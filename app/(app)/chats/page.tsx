"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2, Send, Users } from "lucide-react";
import { useConversations, useCreateConversation } from "@/lib/api/hooks/use-chat";
import { useConnections } from "@/lib/api/hooks/use-connections";
import { useAuth } from "@/lib/auth/context";
import { ChatListItem } from "@/components/chat";
import type { ConnectionCard } from "@/lib/api/types";

function InitialsAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
    const [imgError, setImgError] = useState(false);

    if (photoUrl && !imgError) {
        return (
            <img
                src={photoUrl}
                alt={name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                onError={() => setImgError(true)}
            />
        );
    }

    const initial = name?.[0]?.toUpperCase() ?? "?";
    return (
        <div className="w-12 h-12 rounded-full bg-[#e8d5c8] flex-shrink-0 flex items-center justify-center">
            <span className="text-[18px] font-serif font-semibold text-[#b4532a]">{initial}</span>
        </div>
    );
}

function ConnectionItem({
    connection,
    onStartChat,
    isLoading,
}: {
    connection: ConnectionCard;
    onStartChat: () => void;
    isLoading: boolean;
}) {
    const fullName = `${connection.first_name} ${connection.last_name}`.trim();
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            <InitialsAvatar name={connection.first_name} photoUrl={connection.photo_url} />
            <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-[16px] text-[#181412] truncate leading-snug">
                    {fullName}
                </p>
                {connection.headline && (
                    <p className="font-sans text-[13px] text-[#715e55] truncate leading-snug">
                        {connection.headline}
                    </p>
                )}
            </div>
            <button
                onClick={onStartChat}
                disabled={isLoading}
                className="w-9 h-9 rounded-full bg-[#d8602e] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform disabled:opacity-50"
                aria-label={`Message ${connection.first_name}`}
            >
                {isLoading ? (
                    <Loader2 size={16} className="text-white animate-spin" />
                ) : (
                    <Send size={16} className="text-white" strokeWidth={1.5} />
                )}
            </button>
        </div>
    );
}

export default function ChatsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: conversations, isLoading, error } = useConversations();
    const { data: connections, isLoading: connectionsLoading } = useConnections();
    const createConversation = useCreateConversation();
    const [creatingChatFor, setCreatingChatFor] = useState<string | null>(null);

    const handleConversationClick = (conversationId: string) => {
        router.push(`/chats/${conversationId}`);
    };

    const handleStartChat = async (userId: string) => {
        setCreatingChatFor(userId);
        try {
            const conversation = await createConversation.mutateAsync({ user_id: userId });
            router.push(`/chats/${conversation.id}`);
        } catch (err) {
            console.error("Failed to create conversation:", err);
        } finally {
            setCreatingChatFor(null);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-dvh">
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 size={32} className="text-[#d8602e] animate-spin" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col min-h-dvh">
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 pb-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#ffefe5] flex items-center justify-center">
                        <MessageCircle size={36} className="text-[#d8602e]" strokeWidth={1.5} />
                    </div>
                    <p className="text-[16px] font-sans text-[#715e55]">
                        Failed to load conversations. Please try again.
                    </p>
                </div>
            </div>
        );
    }

    // Empty state - show connections if available
    if (!conversations || conversations.length === 0) {
        const hasConnections = connections && connections.length > 0;

        return (
            <div className="flex flex-col min-h-dvh bg-[#f5f0eb]">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 bg-white">
                    <h1 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                        Chats
                    </h1>
                </div>

                <div className="flex-1 flex flex-col pb-20">
                    {/* Empty state header */}
                    <div className="flex flex-col items-center gap-4 px-8 pt-12 pb-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#ffefe5] flex items-center justify-center">
                            <MessageCircle size={36} className="text-[#d8602e]" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="font-serif font-semibold text-[24px] leading-[32px] text-[#181412]">
                                No Chats Yet
                            </h2>
                            <p className="text-[15px] font-sans font-normal leading-[22px] text-[#715e55]">
                                {hasConnections
                                    ? "Start a conversation with your connections"
                                    : "Connect with people to start chatting!"}
                            </p>
                        </div>
                    </div>

                    {/* Connections list */}
                    {hasConnections && (
                        <div className="mt-2">
                            <div className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-[#715e55]" strokeWidth={1.5} />
                                    <p className="font-sans font-semibold text-[14px] text-[#715e55] uppercase tracking-wide">
                                        Your Connections
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-t-2xl">
                                <div className="divide-y divide-[#f5f0eb]">
                                    {connections.map((connection) => (
                                        <ConnectionItem
                                            key={connection.user_id}
                                            connection={connection}
                                            onStartChat={() => handleStartChat(connection.user_id)}
                                            isLoading={creatingChatFor === connection.user_id}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading connections */}
                    {connectionsLoading && !hasConnections && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={24} className="text-[#d8602e] animate-spin" />
                        </div>
                    )}

                    {/* No connections state */}
                    {!connectionsLoading && !hasConnections && (
                        <div className="flex flex-col items-center gap-4 px-8 pt-4">
                            <button
                                onClick={() => router.push("/discover")}
                                className="px-6 py-3 bg-[#d8602e] text-white font-sans font-semibold text-[15px] rounded-full active:scale-95 transition-transform"
                            >
                                Discover People
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Conversations list
    return (
        <div className="flex flex-col min-h-dvh bg-[#f5f0eb]">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 bg-white">
                <h1 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                    Chats
                </h1>
            </div>

            {/* Conversation list */}
            <div className="flex-1 pb-20">
                <div className="divide-y divide-[#f0e8e2]">
                    {conversations.map((conversation) => (
                        <ChatListItem
                            key={conversation.id}
                            conversation={conversation}
                            currentUserId={user?.id ?? ""}
                            onClick={() => handleConversationClick(conversation.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}