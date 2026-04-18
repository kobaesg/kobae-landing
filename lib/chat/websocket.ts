import { getChatWebSocketUrl, ensureValidAccessToken } from "@/lib/api/client";
import type { WSIncomingMessage, WSOutgoingMessage } from "@/lib/api/types";

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

// WebSocket close codes
const WS_CLOSE_NORMAL = 1000;
const WS_CLOSE_POLICY_VIOLATION = 1008; // Often used for auth failures

export class ChatWebSocket {
    private ws: WebSocket | null = null;
    private options: ChatWebSocketOptions;
    private reconnectAttempts = 0;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private isIntentionallyClosed = false;
    private messageQueue: WSIncomingMessage[] = [];
    private isConnecting = false;

    constructor(options: ChatWebSocketOptions = {}) {
        this.options = {
            reconnectInterval: 3000,
            maxReconnectAttempts: 10,
            ...options,
        };
    }

    /**
     * Update the WebSocket options (e.g., message handlers).
     * This allows updating callbacks when React component dependencies change.
     */
    updateOptions(options: Partial<ChatWebSocketOptions>): void {
        this.options = {
            ...this.options,
            ...options,
        };
    }

    async connect(): Promise<void> {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        this.isConnecting = true;
        this.isIntentionallyClosed = false;

        try {
            // Ensure we have a valid (non-expired) token before connecting
            const token = await ensureValidAccessToken();
            if (!token) {
                console.warn("[ChatWS] No valid access token available, cannot connect");
                this.isConnecting = false;
                return;
            }

            const wsUrl = `${getChatWebSocketUrl()}?token=${encodeURIComponent(token)}`;

            this.ws = new WebSocket(wsUrl);
            this.setupEventHandlers();
        } catch (error) {
            console.error("[ChatWS] Failed to create WebSocket:", error);
            this.isConnecting = false;
            this.scheduleReconnect();
        }
    }

    private setupEventHandlers(): void {
        if (!this.ws) return;

        this.ws.onopen = () => {
            console.log("[ChatWS] Connected");
            this.isConnecting = false;
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
            this.isConnecting = false;
            this.options.onDisconnect?.();

            if (!this.isIntentionallyClosed) {
                // Check if this was an auth-related close
                // Common patterns: 1008 (policy violation), or server closes with specific reason
                const isAuthError = 
                    event.code === WS_CLOSE_POLICY_VIOLATION ||
                    event.reason?.toLowerCase().includes("unauthorized") ||
                    event.reason?.toLowerCase().includes("token") ||
                    event.reason?.toLowerCase().includes("auth");

                if (isAuthError) {
                    console.log("[ChatWS] Auth error detected, will refresh token before reconnecting");
                    // Don't count auth errors toward max attempts - they're recoverable
                    this.reconnectAttempts = Math.max(0, this.reconnectAttempts - 1);
                }

                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error("[ChatWS] Error:", error);
            this.isConnecting = false;
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
        
        // Use exponential backoff with jitter for better reconnection behavior
        const baseDelay = this.options.reconnectInterval ?? 3000;
        const delay = Math.min(baseDelay * Math.pow(1.5, this.reconnectAttempts - 1), 30000);
        const jitter = Math.random() * 1000;

        console.log(`[ChatWS] Reconnecting in ${Math.round(delay + jitter)}ms (attempt ${this.reconnectAttempts})`);

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay + jitter);
    }

    private flushMessageQueue(): void {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) {
                this.send(message);
            }
        }
    }

    async send(message: WSIncomingMessage): Promise<void> {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            // Queue message for when connection is established
            this.messageQueue.push(message);
            // Try to connect if not already connecting
            if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
                await this.connect();
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
            this.ws.close(WS_CLOSE_NORMAL, "Client disconnect");
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

    /**
     * Force a reconnection with a fresh token.
     * Useful when you know the token has been refreshed elsewhere.
     */
    async reconnectWithFreshToken(): Promise<void> {
        console.log("[ChatWS] Forcing reconnection with fresh token");
        this.disconnect();
        this.isIntentionallyClosed = false;
        this.reconnectAttempts = 0;
        await this.connect();
    }
}

// Singleton instance for app-wide use
let chatWebSocketInstance: ChatWebSocket | null = null;

export function getChatWebSocket(options?: ChatWebSocketOptions): ChatWebSocket {
    if (!chatWebSocketInstance) {
        chatWebSocketInstance = new ChatWebSocket(options);
    } else if (options) {
        // Update options on existing instance to ensure callbacks stay current
        // This is critical for React hooks where callbacks change due to dependency updates
        chatWebSocketInstance.updateOptions(options);
    }
    return chatWebSocketInstance;
}

export function disconnectChatWebSocket(): void {
    if (chatWebSocketInstance) {
        chatWebSocketInstance.disconnect();
        chatWebSocketInstance = null;
    }
}