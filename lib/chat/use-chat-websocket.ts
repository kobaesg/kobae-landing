"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatWebSocket, getChatWebSocket, disconnectChatWebSocket } from "./websocket";
import { useAuth } from "@/lib/auth/context";
import { chatKeys } from "@/lib/api/hooks/use-chat";
import type { WSOutgoingMessage, Message, ConversationWithDetails } from "@/lib/api/types";

interface PendingMessage {
    localId: string;
    conversationId: string;
    content: string;
    sentAt: number; // timestamp for timeout tracking
}

interface UseChatWebSocketOptions {
    enabled?: boolean;
}

// Timeout for pending messages (10 seconds)
const MESSAGE_TIMEOUT_MS = 10000;

export function useChatWebSocket(options: UseChatWebSocketOptions = {}) {
    const { enabled = true } = options;
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const wsRef = useRef<ChatWebSocket | null>(null);
    // Initialize isConnected based on existing singleton WebSocket state
    const [isConnected, setIsConnected] = useState(() => {
        const existingWs = getChatWebSocket();
        return existingWs?.isConnected ?? false;
    });
    const [pendingMessages, setPendingMessages] = useState<Map<string, PendingMessage>>(new Map());
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Add message to cache (for both own and received messages)
    const addMessageToCache = useCallback((conversationId: string, message: Message) => {
        // Update messages cache using the infinite query structure
        queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: { pages: Array<{ messages: Message[]; has_more: boolean; next_cursor?: string }>; pageParams: unknown[] } | undefined) => {
                if (!old || !old.pages || old.pages.length === 0) {
                    // Initialize with the message if no data exists
                    return {
                        pages: [{ messages: [message], has_more: false, next_cursor: undefined }],
                        pageParams: [undefined],
                    };
                }
                
                // Check if message already exists (by id or localId)
                const allMessages = old.pages.flatMap(p => p.messages);
                const exists = allMessages.some(m => 
                    m.id === message.id || 
                    (message.localId && m.localId === message.localId)
                );
                if (exists) return old;
                
                // Add to the END of the FIRST page (page 0 has oldest messages first in chronological order)
                // Backend returns messages in chronological order (oldest first), so new messages go at the end
                const newPages = [...old.pages];
                newPages[0] = {
                    ...newPages[0],
                    messages: [...newPages[0].messages, message],
                };
                
                return {
                    ...old,
                    pages: newPages,
                };
            }
        );

        // Update conversation's last message
        queryClient.setQueryData<ConversationWithDetails[]>(
            chatKeys.conversations(),
            (old) => {
                if (!old) return old;
                const updated = old.map((conv) => {
                    if (conv.id !== conversationId) return conv;
                    
                    // Only increment unread if:
                    // 1. We have a valid user ID to compare against
                    // 2. The message is NOT from the current user
                    const isFromCurrentUser = user?.id && message.sender_id === user.id;
                    
                    return {
                        ...conv,
                        last_message: {
                            id: message.id,
                            content: message.content,
                            sender_id: message.sender_id,
                            sent_at: message.sent_at,
                            read_at: message.read_at,
                        },
                        // Don't increment unread for own messages
                        unread_count: isFromCurrentUser 
                            ? conv.unread_count 
                            : conv.unread_count + 1,
                        updated_at: message.sent_at,
                    };
                });
                // Sort by updated_at descending
                return updated.sort(
                    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
            }
        );
    }, [queryClient, user?.id]);

    // Update message status in cache
    const updateMessageStatus = useCallback((
        conversationId: string, 
        localId: string, 
        status: 'sending' | 'sent' | 'failed',
        serverMessage?: Message
    ) => {
        queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: { pages: Array<{ messages: Message[]; has_more: boolean; next_cursor?: string }>; pageParams: unknown[] } | undefined) => {
                if (!old || !old.pages) return old;
                
                const newPages = old.pages.map(page => ({
                    ...page,
                    messages: page.messages.map(msg => {
                        if (msg.localId === localId) {
                            if (serverMessage) {
                                // Replace with server message
                                return {
                                    ...serverMessage,
                                    status: 'sent' as const,
                                };
                            }
                            return { ...msg, status };
                        }
                        return msg;
                    }),
                }));
                
                return { ...old, pages: newPages };
            }
        );
    }, [queryClient]);

    // Update message read status
    const updateMessageReadStatus = useCallback((conversationId: string, messageId: string, readAt: string) => {
        queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: { pages: Array<{ messages: Message[]; has_more: boolean; next_cursor?: string }>; pageParams: unknown[] } | undefined) => {
                if (!old || !old.pages) return old;
                
                const newPages = old.pages.map(page => ({
                    ...page,
                    messages: page.messages.map(msg => {
                        if (msg.id === messageId) {
                            return { ...msg, read_at: readAt };
                        }
                        return msg;
                    }),
                }));
                
                return { ...old, pages: newPages };
            }
        );
    }, [queryClient]);

    // Check for timed out messages
    const checkTimeouts = useCallback(() => {
        const now = Date.now();
        setPendingMessages(prev => {
            const newMap = new Map(prev);
            let hasChanges = false;
            
            for (const [localId, pending] of newMap) {
                if (now - pending.sentAt > MESSAGE_TIMEOUT_MS) {
                    // Mark as failed
                    updateMessageStatus(pending.conversationId, localId, 'failed');
                    newMap.delete(localId);
                    hasChanges = true;
                    console.warn("[useChatWebSocket] Message timed out:", localId);
                }
            }
            
            return hasChanges ? newMap : prev;
        });
    }, [updateMessageStatus]);

    // Start timeout checker
    useEffect(() => {
        if (pendingMessages.size > 0 && !timeoutRef.current) {
            timeoutRef.current = setInterval(checkTimeouts, 1000);
        } else if (pendingMessages.size === 0 && timeoutRef.current) {
            clearInterval(timeoutRef.current);
            timeoutRef.current = null;
        }
        
        return () => {
            if (timeoutRef.current) {
                clearInterval(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [pendingMessages.size, checkTimeouts]);

    // Handle incoming WebSocket messages
    const handleMessage = useCallback(
        (wsMessage: WSOutgoingMessage) => {
            switch (wsMessage.type) {
                case "connected":
                    console.log("[useChatWebSocket] Server confirmed connection");
                    break;

                case "new_message":
                    if (wsMessage.message && wsMessage.conversation_id) {
                        const message = wsMessage.message;
                        const conversationId = wsMessage.conversation_id;
                        
                        // Check if this is confirmation of our own message
                        if (message.sender_id === user?.id) {
                            // Find the pending message by matching content and conversation
                            // Match by content first, then by oldest pending message for same conversation
                            setPendingMessages(prev => {
                                const newMap = new Map(prev);
                                let matchedLocalId: string | null = null;
                                let oldestPendingTime = Infinity;
                                
                                // First try exact content match
                                for (const [localId, pending] of newMap) {
                                    if (pending.conversationId === conversationId && 
                                        pending.content === message.content) {
                                        // Prefer the oldest pending message with matching content
                                        if (pending.sentAt < oldestPendingTime) {
                                            matchedLocalId = localId;
                                            oldestPendingTime = pending.sentAt;
                                        }
                                    }
                                }
                                
                                // If no exact match, try matching any pending message for this conversation
                                // (handles edge cases where content might differ slightly)
                                if (!matchedLocalId) {
                                    oldestPendingTime = Infinity;
                                    for (const [localId, pending] of newMap) {
                                        if (pending.conversationId === conversationId && 
                                            pending.sentAt < oldestPendingTime) {
                                            matchedLocalId = localId;
                                            oldestPendingTime = pending.sentAt;
                                        }
                                    }
                                }
                                
                                if (matchedLocalId) {
                                    // Update the optimistic message with server data
                                    updateMessageStatus(conversationId, matchedLocalId, 'sent', message);
                                    newMap.delete(matchedLocalId);
                                    console.log("[useChatWebSocket] Message confirmed:", matchedLocalId);
                                } else {
                                    // This might be a message from another device/session
                                    addMessageToCache(conversationId, { ...message, status: 'sent' });
                                }
                                
                                return newMap;
                            });
                        } else {
                            // Message from another user
                            addMessageToCache(conversationId, { ...message, status: 'sent' });
                            
                            // Invalidate conversations list to ensure it's up to date
                            // This handles the case where a new conversation is started by someone else
                            queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
                        }
                    }
                    break;

                case "message_read":
                    if (wsMessage.conversation_id && wsMessage.message_id && wsMessage.read_at) {
                        updateMessageReadStatus(
                            wsMessage.conversation_id,
                            wsMessage.message_id,
                            wsMessage.read_at
                        );
                    }
                    break;

                case "user_typing":
                    // Could implement typing indicators here
                    console.log("[useChatWebSocket] User typing:", wsMessage.user_id);
                    break;

                case "user_stop_typing":
                    console.log("[useChatWebSocket] User stopped typing:", wsMessage.user_id);
                    break;

                case "error":
                    console.error("[useChatWebSocket] Server error:", wsMessage.error);
                    // Mark all pending messages for this conversation as failed if we can identify them
                    // For now, just log the error
                    break;

                default:
                    console.log("[useChatWebSocket] Unknown message type:", wsMessage.type);
            }
        },
        [user?.id, addMessageToCache, updateMessageStatus, updateMessageReadStatus, queryClient]
    );

    // Connect/disconnect based on auth state
    useEffect(() => {
        if (!enabled || !isAuthenticated) {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        // Create WebSocket connection
        const ws = getChatWebSocket({
            onMessage: handleMessage,
            onConnect: () => setIsConnected(true),
            onDisconnect: () => setIsConnected(false),
            onError: (error) => console.error("[useChatWebSocket] Error:", error),
        });

        wsRef.current = ws;
        
        // Connect asynchronously (handles token refresh internally)
        ws.connect().catch((error) => {
            console.error("[useChatWebSocket] Failed to connect:", error);
        });

        return () => {
            // Don't disconnect on unmount - keep connection alive for app
            // disconnectChatWebSocket();
        };
    }, [enabled, isAuthenticated, handleMessage]);

    // Send message with optimistic update
    const sendMessage = useCallback((conversationId: string, content: string) => {
        if (!user?.id) {
            console.error("[useChatWebSocket] Cannot send message: no user");
            return;
        }

        const localId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        // Create optimistic message
        const optimisticMessage: Message = {
            id: localId, // Temporary ID
            conversation_id: conversationId,
            sender_id: user.id,
            content,
            sent_at: now,
            status: 'sending',
            localId,
        };

        // Add to cache immediately
        addMessageToCache(conversationId, optimisticMessage);

        // Track as pending
        setPendingMessages(prev => {
            const newMap = new Map(prev);
            newMap.set(localId, {
                localId,
                conversationId,
                content,
                sentAt: Date.now(),
            });
            return newMap;
        });

        // Send via WebSocket
        wsRef.current?.sendMessage(conversationId, content);
    }, [user?.id, addMessageToCache]);

    // Retry failed message
    const retryMessage = useCallback((conversationId: string, localId: string, content: string) => {
        // Update status to sending
        updateMessageStatus(conversationId, localId, 'sending');

        // Track as pending again
        setPendingMessages(prev => {
            const newMap = new Map(prev);
            newMap.set(localId, {
                localId,
                conversationId,
                content,
                sentAt: Date.now(),
            });
            return newMap;
        });

        // Send via WebSocket
        wsRef.current?.sendMessage(conversationId, content);
    }, [updateMessageStatus]);

    // Remove failed message from cache
    const removeFailedMessage = useCallback((conversationId: string, localId: string) => {
        queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: { pages: Array<{ messages: Message[]; has_more: boolean; next_cursor?: string }>; pageParams: unknown[] } | undefined) => {
                if (!old || !old.pages) return old;
                
                const newPages = old.pages.map(page => ({
                    ...page,
                    messages: page.messages.filter(msg => msg.localId !== localId),
                }));
                
                return { ...old, pages: newPages };
            }
        );
    }, [queryClient]);

    const sendTyping = useCallback((conversationId: string) => {
        wsRef.current?.sendTyping(conversationId);
    }, []);

    const sendStopTyping = useCallback((conversationId: string) => {
        wsRef.current?.sendStopTyping(conversationId);
    }, []);

    const markRead = useCallback((conversationId: string, messageId: string) => {
        wsRef.current?.markRead(conversationId, messageId);
    }, []);

    return {
        isConnected,
        sendMessage,
        retryMessage,
        removeFailedMessage,
        sendTyping,
        sendStopTyping,
        markRead,
    };
}

// Provider component to initialize WebSocket at app level
export function ChatWebSocketProvider({ children }: { children: React.ReactNode }) {
    // Initialize WebSocket connection
    useChatWebSocket({ enabled: true });
    return React.createElement(React.Fragment, null, children);
}