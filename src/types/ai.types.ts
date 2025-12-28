export interface IAiMessage {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface IAiConversation {
  id: number;
  problem_id: number;
  user_id: number;
  created_at: string;
}

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