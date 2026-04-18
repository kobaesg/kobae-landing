import { getAccessToken, getChatWebSocketUrl } from "@/lib/api/client";
import type { WSIncomingMessage, WSOutgoingMessage, Message } from "@/lib/api/types";

type MessageHandler = (message: WSOutgoingMessage) => void;
type ConnectionHandler = () => void;

interface ChatWebSocketOptions {
    onMessage?: MessageHandler;
    onConnect?: ConnectionHandler;
    onDisconnect?: ConnectionHandler;
    onError?: (error: Event) => void;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

export class ChatWebSocket {
    private ws: WebSocket | null = null;
    private options: ChatWebSocketOptions;
    private reconnectAttempts = 0;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private isIntentionallyClosed = false;
    private messageQueue: WSIncomingMessage[] = [];

    constructor(options: ChatWebSocketOptions = {}) {
        this.options = {
            reconnectInterval: 3000,
            maxReconnectAttempts: 10,
            ...options,
        };
    }

    connect(): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        const token = getAccessToken();
        if (!token) {
            console.warn("[ChatWS] No access token available, cannot connect");
            return;
        }

        this.isIntentionallyClosed = false;
        const wsUrl = `${getChatWebSocketUrl()}?token=${encodeURIComponent(token)}`;

        try {
            this.ws = new WebSocket(wsUrl);
            this.setupEventHandlers();
        } catch (error) {
            console.error("[ChatWS] Failed to create WebSocket:", error);
            this.scheduleReconnect();
        }
    }

    private setupEventHandlers(): void {
        if (!this.ws) return;

        this.ws.onopen = () => {
            console.log("[ChatWS] Connected");
            this.reconnectAttempts = 0;
            this.options.onConnect?.();
            this.flushMessageQueue();
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as WSOutgoingMessage;
                this.options.onMessage?.(message);
            } catch (error) {
                console.error("[ChatWS] Failed to parse message:", error);
            }
        };

        this.ws.onclose = (event) => {
            console.log("[ChatWS] Disconnected:", event.code, event.reason);
            this.options.onDisconnect?.();

            if (!this.isIntentionallyClosed) {
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error("[ChatWS] Error:", error);
            this.options.onError?.(error);
        };
    }

    private scheduleReconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.reconnectAttempts >= (this.options.maxReconnectAttempts ?? 10)) {
            console.warn("[ChatWS] Max reconnect attempts reached");
            return;
        }

        this.reconnectAttempts++;
        const delay = this.options.reconnectInterval ?? 3000;

        console.log(`[ChatWS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay);
    }

    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) {
                this.send(message);
            }
        }
    }

    send(message: WSIncomingMessage): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            // Queue message for when connection is established
            this.messageQueue.push(message);
            // Try to connect if not already connecting
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                this.connect();
            }
        }
    }

    disconnect(): void {
        this.isIntentionallyClosed = true;

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            this.ws.close(1000, "Client disconnect");
            this.ws = null;
        }
    }

    // Convenience methods for common operations
    sendMessage(conversationId: string, content: string): void {
        this.send({
            type: "send_message",
            conversation_id: conversationId,
            content,
        });
    }

    sendTyping(conversationId: string): void {
        this.send({
            type: "typing",
            conversation_id: conversationId,
        });
    }

    sendStopTyping(conversationId: string): void {
        this.send({
            type: "stop_typing",
            conversation_id: conversationId,
        });
    }

    markRead(conversationId: string, messageId: string): void {
        this.send({
            type: "mark_read",
            conversation_id: conversationId,
            message_id: messageId,
        });
    }

    get isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    get readyState(): number | undefined {
        return this.ws?.readyState;
    }
}

// Singleton instance for app-wide use
let chatWebSocketInstance: ChatWebSocket | null = null;

export function getChatWebSocket(options?: ChatWebSocketOptions): ChatWebSocket {
    if (!chatWebSocketInstance) {
        chatWebSocketInstance = new ChatWebSocket(options);
    }
    return chatWebSocketInstance;
}

export function disconnectChatWebSocket(): void {
    if (chatWebSocketInstance) {
        chatWebSocketInstance.disconnect();
        chatWebSocketInstance = null;
    }
}