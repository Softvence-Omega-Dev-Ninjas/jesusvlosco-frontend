/**
 * Private Chat Socket Usage Examples
 *
 * This file demonstrates how to use the private chat socket functions
 * from the separate privateChatSocket.ts file.
 */

import {
  // Main functions
  connectPrivateChat,
  loadPrivateConversations,
  loadPrivateConversation,
  sendPrivateMessage,
  disconnectPrivateChat,

  // Event listeners
  onPrivateNewMessage,
  onPrivateNewConversation,
  onPrivateError,

  // Utility functions
  getPrivateChatUserId,
  isPrivateChatConnected,

  // Types
  type SendMessagePayload,
  type ChatMessage,
  type ConversationSummary,
  type FullConversation,
  type PrivateChatError,
  type ChatFile
} from '@/utils/privateChatSocket';

/**
 * Example 1: Basic Connection and Setup
 */
export const setupPrivateChat = async (token: string) => {
  try {
    // Connect to private chat
    const userId = await connectPrivateChat(token);
    console.log('Connected with userId:', userId);

    // Set up event listeners
    onPrivateNewMessage((message: ChatMessage) => {
      console.log('New message received:', message);
      // Handle new message in your UI
    });

    onPrivateNewConversation((conversations: ConversationSummary[]) => {
      console.log('Conversations updated:', conversations);
      // Update conversation list in your UI
    });

    onPrivateError((error: PrivateChatError) => {
      console.error('Chat error:', error.message);
      // Handle error in your UI
    });

    return userId;
  } catch (error) {
    console.error('Failed to connect to private chat:', error);
    throw error;
  }
};

/**
 * Example 2: Load All Conversations
 */
export const loadAllConversations = async (): Promise<ConversationSummary[]> => {
  try {
    if (!isPrivateChatConnected()) {
      throw new Error('Not connected to private chat');
    }

    const conversations = await loadPrivateConversations();
    console.log('Loaded conversations:', conversations);
    return conversations;
  } catch (error) {
    console.error('Failed to load conversations:', error);
    throw error;
  }
};

/**
 * Example 3: Load Single Conversation with Message History
 */
export const loadConversationDetails = async (conversationId: string): Promise<FullConversation> => {
  try {
    if (!isPrivateChatConnected()) {
      throw new Error('Not connected to private chat');
    }

    const conversation = await loadPrivateConversation(conversationId);
    console.log('Loaded conversation details:', conversation);
    return conversation;
  } catch (error) {
    console.error('Failed to load conversation:', error);
    throw error;
  }
};

/**
 * Example 4: Send a Message
 */
export const sendMessage = async (
  recipientId: string,
  content: string,
  file: ChatFile | null = null
): Promise<ChatMessage> => {
  try {
    const userId = getPrivateChatUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const payload: SendMessagePayload = {
      userId,
      recipientId,
      dto: { content },
      file
    };

    const sentMessage = await sendPrivateMessage(payload);
    console.log('Message sent:', sentMessage);
    return sentMessage;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

/**
 * Example 5: Complete Chat Component Integration
 */
export const usePrivateChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [currentConversation, setCurrentConversation] = useState<FullConversation | null>(null);

  // Initialize chat
  const initializeChat = async (token: string) => {
    try {
      await setupPrivateChat(token);
      setIsConnected(true);

      // Load initial conversations
      const convs = await loadAllConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setIsConnected(false);
    }
  };

  // Load conversation details
  const loadConversation = async (conversationId: string) => {
    try {
      const conversation = await loadConversationDetails(conversationId);
      setCurrentConversation(conversation);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  // Send message
  const sendChatMessage = async (recipientId: string, content: string) => {
    try {
      await sendMessage(recipientId, content);
      // Message will be received via onPrivateNewMessage listener
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Cleanup
  const disconnect = () => {
    disconnectPrivateChat();
    setIsConnected(false);
    setConversations([]);
    setCurrentConversation(null);
  };

  return {
    isConnected,
    conversations,
    currentConversation,
    initializeChat,
    loadConversation,
    sendChatMessage,
    disconnect
  };
};

/**
 * Example 6: React Hook Usage
 */
import { useState, useEffect } from 'react';

export const usePrivateChatMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const conversation = await loadPrivateConversation(conversationId);
        setMessages(conversation.messages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Listen for new messages in this conversation
    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, message]);
      }
    };

    onPrivateNewMessage(handleNewMessage);

    return () => {
      // Cleanup listener when component unmounts or conversationId changes
      // Note: In a real implementation, you'd want to properly remove the specific listener
    };
  }, [conversationId]);

  return { messages, loading };
};