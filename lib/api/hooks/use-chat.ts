import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "../client";
import type {
    ConversationWithDetails,
    Message,
    CreateConversationRequest,
    SendMessageRequest,
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
            // Flatten all messages and reverse to show oldest first
            messages: data.pages.flatMap((page) => page.messages).reverse(),
        }),
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            conversationId,
            content,
        }: {
            conversationId: string;
            content: string;
        }) => {
            const response = await chatApi.sendMessage(conversationId, { content });
            return { message: response.data.message, conversationId };
        },
        onSuccess: ({ message, conversationId }) => {
            // Optimistically add message to cache
            queryClient.setQueryData(
                chatKeys.messages(conversationId),
                (old: ReturnType<typeof useMessages>["data"]) => {
                    if (!old) return old;
                    return {
                        ...old,
                        messages: [...old.messages, message],
                    };
                }
            );

            // Update conversation's last message
            queryClient.setQueryData<ConversationWithDetails[]>(
                chatKeys.conversations(),
                (old) => {
                    if (!old) return old;
                    return old.map((conv) => {
                        if (conv.id !== conversationId) return conv;
                        return {
                            ...conv,
                            last_message: {
                                id: message.id,
                                content: message.content,
                                sender_id: message.sender_id,
                                sent_at: message.sent_at,
                                read_at: message.read_at,
                            },
                            updated_at: message.sent_at,
                        };
                    });
                }
            );
        },
    });
}

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

// ── Cache Helpers (for WebSocket updates) ─────────────────

export function useAddMessageToCache() {
    const queryClient = useQueryClient();

    return (conversationId: string, message: Message) => {
        // Add to messages cache
        queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: ReturnType<typeof useMessages>["data"]) => {
                if (!old) return old;
                // Check if message already exists
                if (old.messages.some((m) => m.id === message.id)) return old;
                return {
                    ...old,
                    messages: [...old.messages, message],
                };
            }
        );

        // Update conversation's last message and move to top
        queryClient.setQueryData<ConversationWithDetails[]>(
            chatKeys.conversations(),
            (old) => {
                if (!old) return old;
                const updated = old.map((conv) => {
                    if (conv.id !== conversationId) return conv;
                    return {
                        ...conv,
                        last_message: {
                            id: message.id,
                            content: message.content,
                            sender_id: message.sender_id,
                            sent_at: message.sent_at,
                            read_at: message.read_at,
                        },
                        unread_count: conv.unread_count + 1,
                        updated_at: message.sent_at,
                    };
                });
                // Sort by updated_at descending
                return updated.sort(
                    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
            }
        );

        // Invalidate unread count
        queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
    };
}

export function useUpdateMessageReadStatus() {
    const queryClient = useQueryClient();

    return (conversationId: string, messageId: string, readAt: string) => {
        queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: ReturnType<typeof useMessages>["data"]) => {
                if (!old) return old;
                return {
                    ...old,
                    messages: old.messages.map((m) => {
                        if (m.id !== messageId) return m;
                        return { ...m, read_at: readAt };
                    }),
                };
            }
        );
    };
}