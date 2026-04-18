"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatWebSocket, getChatWebSocket, disconnectChatWebSocket } from "./websocket";
import { useAuth } from "@/lib/auth/context";
import { chatKeys, useAddMessageToCache, useUpdateMessageReadStatus } from "@/lib/api/hooks/use-chat";
import type { WSOutgoingMessage, Message, ConversationWithDetails } from "@/lib/api/types";

interface UseChatWebSocketOptions {
    enabled?: boolean;
}

export function useChatWebSocket(options: UseChatWebSocketOptions = {}) {
    const { enabled = true } = options;
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const wsRef = useRef<ChatWebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const addMessageToCache = useAddMessageToCache();
    const updateMessageReadStatus = useUpdateMessageReadStatus();

    // Handle incoming WebSocket messages
    const handleMessage = useCallback(
        (wsMessage: WSOutgoingMessage) => {
            switch (wsMessage.type) {
                case "connected":
                    console.log("[useChatWebSocket] Server confirmed connection");
                    break;

                case "new_message":
                    if (wsMessage.message && wsMessage.conversation_id) {
                        // Don't add our own messages (they're already added via mutation)
                        if (wsMessage.message.sender_id !== user?.id) {
                            addMessageToCache(wsMessage.conversation_id, wsMessage.message);
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
                    break;

                default:
                    console.log("[useChatWebSocket] Unknown message type:", wsMessage.type);
            }
        },
        [user?.id, addMessageToCache, updateMessageReadStatus]
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
        ws.connect();

        return () => {
            // Don't disconnect on unmount - keep connection alive for app
            // disconnectChatWebSocket();
        };
    }, [enabled, isAuthenticated, handleMessage]);

    // Convenience methods
    const sendMessage = useCallback((conversationId: string, content: string) => {
        wsRef.current?.sendMessage(conversationId, content);
    }, []);

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
