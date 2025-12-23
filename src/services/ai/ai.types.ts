import type { IAiMessage, IAiConversation } from "../../types/ai.types";

export interface ChatPayload {
  conversationId: number;
  message: string;
}

export interface ChatResponse {
  conversationId: number;
  answer: string;
  provider: string; 
  messages: IAiMessage[];
}

export interface ConversationResponse {
  conversation: IAiConversation;
  messages: IAiMessage[];
}

export interface MessagesResponse {
  conversationId: number;
  messages: IAiMessage[];
}