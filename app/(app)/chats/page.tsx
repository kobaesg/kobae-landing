"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";
import { useConversations } from "@/lib/api/hooks/use-chat";
import { useAuth } from "@/lib/auth/context";
import { ChatListItem } from "@/components/chat";

export default function ChatsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { data: conversations, isLoading, error } = useConversations();

    const handleConversationClick = (conversationId: string) => {
        router.push(`/chats/${conversationId}`);
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

    // Empty state
    if (!conversations || conversations.length === 0) {
        return (
            <div className="flex flex-col min-h-dvh">
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#ffefe5] flex items-center justify-center">
                        <MessageCircle size={36} className="text-[#d8602e]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                            No Chats Yet
                        </h2>
                        <p className="text-[16px] font-sans font-normal leading-[24px] text-[#715e55]">
                            Connect with people to start chatting!
                        </p>
                    </div>
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