"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useConversation, useMessages, useSendMessage, useMarkRead } from "@/lib/api/hooks/use-chat";
import { useAuth } from "@/lib/auth/context";
import { ChatHeader, ChatBubble, ChatInput, DateSeparator, ScrollToBottomFAB } from "@/components/chat";
import type { Message } from "@/lib/api/types";

// Helper to check if two dates are on different days
function isDifferentDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() !== date2.getFullYear() ||
        date1.getMonth() !== date2.getMonth() ||
        date1.getDate() !== date2.getDate()
    );
}

// Group messages by date and determine if avatar should be shown
function processMessages(messages: Message[], currentUserId: string) {
    const processed: Array<{
        type: "date" | "message";
        date?: Date;
        message?: Message;
        isFromMe?: boolean;
        showAvatar?: boolean;
    }> = [];

    let lastDate: Date | null = null;
    let lastSenderId: string | null = null;

    for (const message of messages) {
        const messageDate = new Date(message.sent_at);
        const isFromMe = message.sender_id === currentUserId;

        // Add date separator if needed
        if (!lastDate || isDifferentDay(lastDate, messageDate)) {
            processed.push({ type: "date", date: messageDate });
            lastSenderId = null; // Reset sender tracking on new day
        }

        // Show avatar only for first message in a sequence from same sender
        const showAvatar = !isFromMe && message.sender_id !== lastSenderId;

        processed.push({
            type: "message",
            message,
            isFromMe,
            showAvatar,
        });

        lastDate = messageDate;
        lastSenderId = message.sender_id;
    }

    return processed;
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const conversationId = params.conversationId as string;
    const { user } = useAuth();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [showScrollFAB, setShowScrollFAB] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const { data: conversation, isLoading: conversationLoading } = useConversation(conversationId);
    const { data: messagesData, isLoading: messagesLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(conversationId);
    const sendMessage = useSendMessage();
    const markRead = useMarkRead();

    const messages = messagesData?.messages ?? [];
    const processedMessages = processMessages(messages, user?.id ?? "");

    // Scroll to bottom
    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    // Auto-scroll on new messages if at bottom
    useEffect(() => {
        if (isAtBottom && messages.length > 0) {
            scrollToBottom("auto");
        }
    }, [messages.length, isAtBottom, scrollToBottom]);

    // Mark messages as read when viewing
    useEffect(() => {
        if (conversationId && conversation && conversation.unread_count > 0) {
            markRead.mutate(conversationId);
        }
    }, [conversationId, conversation?.unread_count]);

    // Handle scroll to detect if user is at bottom
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const atBottom = distanceFromBottom < 100;

        setIsAtBottom(atBottom);
        setShowScrollFAB(!atBottom);

        // Load more messages when scrolling to top
        if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Handle send message
    const handleSend = (content: string) => {
        if (!conversationId) return;
        sendMessage.mutate({ conversationId, content });
        // Scroll to bottom after sending
        setTimeout(() => scrollToBottom("smooth"), 100);
    };

    // Loading state
    if (conversationLoading || messagesLoading) {
        return (
            <div className="flex flex-col h-dvh bg-[#f5f0eb]">
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 size={32} className="text-[#d8602e] animate-spin" />
                </div>
            </div>
        );
    }

    // Error state - conversation not found
    if (!conversation) {
        return (
            <div className="flex flex-col h-dvh bg-[#f5f0eb]">
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
                    <p className="text-[16px] font-sans text-[#715e55]">
                        Conversation not found
                    </p>
                    <button
                        onClick={() => router.push("/chats")}
                        className="text-[#d8602e] font-sans font-semibold"
                    >
                        Go back to chats
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-dvh bg-[#f5f0eb]">
            {/* Header */}
            <ChatHeader
                participant={conversation.participant}
                onBack={() => router.push("/chats")}
            />

            {/* Messages area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-4 relative"
            >
                {/* Loading more indicator */}
                {isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                        <Loader2 size={24} className="text-[#d8602e] animate-spin" />
                    </div>
                )}

                {/* Messages */}
                <div className="flex flex-col gap-3">
                    {processedMessages.map((item, index) => {
                        if (item.type === "date" && item.date) {
                            return <DateSeparator key={`date-${index}`} date={item.date} />;
                        }

                        if (item.type === "message" && item.message) {
                            return (
                                <ChatBubble
                                    key={item.message.id}
                                    message={item.message}
                                    isFromMe={item.isFromMe ?? false}
                                    sender={conversation.participant}
                                    showAvatar={item.showAvatar}
                                />
                            );
                        }

                        return null;
                    })}
                </div>

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />

                {/* Scroll to bottom FAB */}
                <ScrollToBottomFAB
                    visible={showScrollFAB}
                    onClick={() => scrollToBottom("smooth")}
                />
            </div>

            {/* Input area */}
            <ChatInput
                onSend={handleSend}
                disabled={sendMessage.isPending}
            />
        </div>
    );
}