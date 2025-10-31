import { io, Socket } from "socket.io-client";

// Private Chat Events Enum (matches backend)
export enum PrivateChatEvents {
  ERROR = 'private:error',
  SUCCESS = 'private:success',
  NEW_MESSAGE = 'private:new_message',
  SEND_MESSAGE = 'private:send_message',
  NEW_CONVERSATION = 'private:new_conversation',
  CONVERSATION_LIST = 'private:conversation_list',
  LOAD_CONVERSATIONS = 'private:load_conversations',
  LOAD_SINGLE_CONVERSATION = 'private:load_single_conversation'
}

// Types based on the specification
export interface ChatFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface ChatUser {
  id: string;
  profile: {
    profileUrl?: string | null;
    firstName: string;
    lastName: string;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  fileId: string | null;
  isRead: boolean;
  createdAt: string;
  sender: ChatUser;
  file: ChatFile | null;
}

export interface ConversationSummary {
  type: 'private';
  chatId: string;
  participant: ChatUser;
  lastMessage: ChatMessage;
  updatedAt: string;
  isRead: boolean;
}

export interface FullConversation {
  conversationId: string;
  participants: ChatUser[];
  messages: ChatMessage[];
}

export interface SendMessagePayload {
  userId: string;
  recipientId: string;
  dto: { content: string };
  file: ChatFile | null;
}

export interface PrivateChatError {
  message: string;
}

// Private Chat Socket Manager Class
class PrivateChatSocketManager {
  private socket: Socket | null = null;
  private currentUserId: string | null = null;
  private isConnected = false;

  /**
   * Connect to private chat namespace
   */
  connect(token: string): Promise<string> {
    console.log("🔌 Connecting to private chat...");
    console.log("🔌 Token:", token);
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.currentUserId || '');
        return;
      }

      // Connect to private namespace
      this.socket = io("https://lgcglobalcontractingltd.com/js/private", {
        auth: {
            token: `Bearer ${token}`
        },
        transports: ["websocket", "polling"],
      });

      // Connection events
      this.socket.on("connect", () => {
        console.log("✅ Connected to private chat:", this.socket?.id);
        this.isConnected = true;
      });

      this.socket.on("disconnect", () => {
        console.log("❌ Disconnected from private chat");
        this.isConnected = false;
        this.currentUserId = null;
      });

      this.socket.on("connect_error", (err) => {
        console.error("❌ Private chat connection error:", err.message);
        reject(err);
      });

      // Authentication success - store userId
      this.socket.on(PrivateChatEvents.SUCCESS, (userId: string) => {
        console.log("🔐 Private chat authenticated, userId:", userId);
        this.currentUserId = userId;
        resolve(userId);
      });

      // Error handling
      this.socket.on(PrivateChatEvents.ERROR, (error: PrivateChatError) => {
        console.error("❌ Private chat error:", error.message);
        reject(new Error(error.message));
      });
    });
  }

  /**
   * Load all conversations
   */
  loadConversations(): Promise<ConversationSummary[]> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("Socket not connected"));
        return;
      }

      // Set up one-time listener for conversation list
      const handleConversationList = (conversations: ConversationSummary[]) => {
        this.socket?.off(PrivateChatEvents.CONVERSATION_LIST, handleConversationList);

        // Console log the conversations
        console.log("📋 Chat Conversations from Socket:", conversations);
        console.log("📊 Total Conversations:", conversations.length);

        // Log details of each conversation
        conversations.forEach((conv, index) => {
          console.log(`💬 Conversation ${index + 1}:`, {
            chatId: conv.chatId,
            participant: conv.participant,
            lastMessage: conv.lastMessage,
            updatedAt: conv.updatedAt,
            isRead: conv.isRead
          });
        });

        resolve(conversations);
      };

      this.socket.on(PrivateChatEvents.CONVERSATION_LIST, handleConversationList);

      // Emit load conversations request
      console.log("🔄 Requesting chat conversations from server...");
      this.socket.emit(PrivateChatEvents.LOAD_CONVERSATIONS);
    });
  }

  /**
   * Load single conversation with full message history
   */
  loadSingleConversation(conversationId: string): Promise<FullConversation> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("Socket not connected"));
        return;
      }

      // Set up one-time listener for new conversation
      const handleNewConversation = (conversation: FullConversation) => {
        this.socket?.off(PrivateChatEvents.NEW_CONVERSATION, handleNewConversation);
        resolve(conversation);
      };

      this.socket.on(PrivateChatEvents.NEW_CONVERSATION, handleNewConversation);

      // Emit load single conversation request
      this.socket.emit(PrivateChatEvents.LOAD_SINGLE_CONVERSATION, conversationId);
    });
  }

  /**
   * Send a private message
   */
  sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error("Socket not connected"));
        return;
      }

      if (!this.currentUserId) {
        reject(new Error("User not authenticated"));
        return;
      }

      // Validate payload
      if (payload.userId !== this.currentUserId) {
        reject(new Error("User ID mismatch"));
        return;
      }

      if (payload.userId === payload.recipientId) {
        reject(new Error("Cannot send message to yourself"));
        return;
      }

      // Set up one-time listener for new message (confirmation)
      const handleNewMessage = (message: ChatMessage) => {
        this.socket?.off(PrivateChatEvents.NEW_MESSAGE, handleNewMessage);
        resolve(message);
      };

      this.socket.on(PrivateChatEvents.NEW_MESSAGE, handleNewMessage);

      // Emit send message
      this.socket.emit(PrivateChatEvents.SEND_MESSAGE, payload);
    });
  }

  /**
   * Listen for new messages
   */
  onNewMessage(callback: (message: ChatMessage) => void): void {
    if (!this.socket) return;
    this.socket.on(PrivateChatEvents.NEW_MESSAGE, callback);
  }

  /**
   * Listen for new conversations
   */
  onNewConversation(callback: (conversations: ConversationSummary[]) => void): void {
    if (!this.socket) return;
    this.socket.on(PrivateChatEvents.NEW_CONVERSATION, callback);
  }

  /**
   * Listen for errors
   */
  onError(callback: (error: PrivateChatError) => void): void {
    if (!this.socket) return;
    this.socket.on(PrivateChatEvents.ERROR, callback);
  }

  /**
   * Remove all listeners for a specific event
   */
  off(event: PrivateChatEvents, listener?: (...args: unknown[]) => void): void {
    if (!this.socket) return;
    if (listener) {
      this.socket.off(event, listener);
    } else {
      this.socket.off(event);
    }
  }

  /**
   * Disconnect from private chat
   */
  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Disconnecting private chat socket");
      this.socket.disconnect();
      this.socket = null;
      this.currentUserId = null;
      this.isConnected = false;
    }
  }

  /**
   * Get current connection status
   */
  get isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get current user ID
   */
  get userId(): string | null {
    return this.currentUserId;
  }

  /**
   * Get socket instance (for advanced usage)
   */
  get socketInstance(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const privateChatSocket = new PrivateChatSocketManager();

// Export convenience functions for direct use
export const connectPrivateChat = (token: string) => privateChatSocket.connect(token);
export const loadPrivateConversations = () => privateChatSocket.loadConversations();
export const loadPrivateConversation = (conversationId: string) => privateChatSocket.loadSingleConversation(conversationId);
export const sendPrivateMessage = (payload: SendMessagePayload) => privateChatSocket.sendMessage(payload);
export const disconnectPrivateChat = () => privateChatSocket.disconnect();

// Event listeners
export const onPrivateNewMessage = (callback: (message: ChatMessage) => void) => privateChatSocket.onNewMessage(callback);
export const onPrivateNewConversation = (callback: (conversations: ConversationSummary[]) => void) => privateChatSocket.onNewConversation(callback);
export const onPrivateError = (callback: (error: PrivateChatError) => void) => privateChatSocket.onError(callback);

// Utility functions
export const getPrivateChatUserId = () => privateChatSocket.userId;
export const isPrivateChatConnected = () => privateChatSocket.isSocketConnected;