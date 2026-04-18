import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "../client";
import type {
    ConversationWithDetails,
    Message,
    CreateConversationRequest,
} from "../types";

// Query keys
export const chatKeys = {
    all: ["chat"] as const,
    conversations: () => [...chatKeys.all, "conversations"] as const,
    conversation: (id: string) => [...chatKeys.all, "conversation", id] as const,
    messages: (conversationId: string) => [...chatKeys.all, "messages", conversationId] as const,
    unreadCount: () => [...chatKeys.all, "unread-count"] as const,
};

// ── Conversations ─────────────────────────────────────────

export function useConversations() {
    return useQuery({
        queryKey: chatKeys.conversations(),
        queryFn: async () => {
            const response = await chatApi.getConversations();
            return response.data.conversations;
        },
    });
}

export function useConversation(conversationId: string | undefined) {
    return useQuery({
        queryKey: chatKeys.conversation(conversationId ?? ""),
        queryFn: async () => {
            if (!conversationId) throw new Error("No conversation ID");
            const response = await chatApi.getConversation(conversationId);
            return response.data.conversation;
        },
        enabled: !!conversationId,
    });
}

export function useCreateConversation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateConversationRequest) => {
            const response = await chatApi.createConversation(data);
            return response.data.conversation;
        },
        onSuccess: (conversation) => {
            // Add to conversations list
            queryClient.setQueryData<ConversationWithDetails[]>(
                chatKeys.conversations(),
                (old) => {
                    if (!old) return [conversation];
                    // Check if already exists
                    const exists = old.some((c) => c.id === conversation.id);
                    if (exists) return old;
                    return [conversation, ...old];
                }
            );
            // Set individual conversation cache
            queryClient.setQueryData(chatKeys.conversation(conversation.id), conversation);
        },
    });
}

// ── Messages ──────────────────────────────────────────────

export function useMessages(conversationId: string | undefined) {
    return useInfiniteQuery({
        queryKey: chatKeys.messages(conversationId ?? ""),
        queryFn: async ({ pageParam }) => {
            if (!conversationId) throw new Error("No conversation ID");
            const response = await chatApi.getMessages(conversationId, {
                limit: 50,
                before: pageParam,
            });
            return response.data;
        },
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            if (!lastPage.has_more) return undefined;
            return lastPage.next_cursor;
        },
        enabled: !!conversationId,
        select: (data) => ({
            pages: data.pages,
            pageParams: data.pageParams,
            // Flatten all messages - backend already returns in chronological order (oldest first)
            messages: data.pages.flatMap((page) => page.messages),
        }),
    });
}

// Note: Message sending is now handled via WebSocket in use-chat-websocket.ts
// The useSendMessage mutation has been removed in favor of WebSocket-based messaging
// which provides better real-time experience with optimistic updates and retry support

// ── Read Status ───────────────────────────────────────────

export function useMarkRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (conversationId: string) => {
            const response = await chatApi.markRead(conversationId);
            return { ...response.data, conversationId };
        },
        onSuccess: ({ conversationId }) => {
            // Update unread count in conversation
            queryClient.setQueryData<ConversationWithDetails[]>(
                chatKeys.conversations(),
                (old) => {
                    if (!old) return old;
                    return old.map((conv) => {
                        if (conv.id !== conversationId) return conv;
                        return { ...conv, unread_count: 0 };
                    });
                }
            );

            // Invalidate unread count
            queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
        },
    });
}

export function useChatUnreadCount() {
    return useQuery({
        queryKey: chatKeys.unreadCount(),
        queryFn: async () => {
            const response = await chatApi.getUnreadCount();
            return response.data.total_unread;
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });
}

// Note: Cache helpers for WebSocket updates are now in use-chat-websocket.ts
// They have been moved there to properly handle the infinite query data structure
