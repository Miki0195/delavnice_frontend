import apiClient from './client';

export interface Message {
  id: number;
  conversation: number;
  sender: number;
  sender_name: string;
  sender_email: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  participant_1: number;
  participant_2: number;
  workshop: number | null;
  workshop_title: string | null;
  other_participant_name: string;
  other_participant_id: number;
  latest_message: {
    content: string;
    created_at: string;
    sender_id: number;
  } | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail {
  id: number;
  participant_1: number;
  participant_2: number;
  workshop: number | null;
  workshop_title: string | null;
  other_participant_name: string;
  other_participant_id: number;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface StartConversationData {
  recipient_id: number;
  workshop_id?: number;
  message: string;
}

/**
 * Get all conversations for the current user
 */
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await apiClient.get('/auth/messages/conversations/');
  
  // Handle both array and paginated response
  if (Array.isArray(response.data)) {
    return response.data;
  }
  
  // If paginated, return results array
  if (response.data && response.data.results) {
    return response.data.results;
  }
  
  // Fallback to empty array
  return [];
};

/**
 * Get a specific conversation with all messages
 */
export const getConversation = async (id: number): Promise<ConversationDetail> => {
  const response = await apiClient.get<ConversationDetail>(`/auth/messages/conversations/${id}/`);
  return response.data;
};

/**
 * Start a new conversation or get existing one
 */
export const startConversation = async (data: StartConversationData): Promise<ConversationDetail> => {
  // Only include workshop_id if it's defined
  const payload: any = {
    recipient_id: data.recipient_id,
    message: data.message,
  };
  
  if (data.workshop_id !== undefined && data.workshop_id !== null) {
    payload.workshop_id = data.workshop_id;
  }
  
  console.log('Starting conversation with payload:', payload);
  
  const response = await apiClient.post<ConversationDetail>('/auth/messages/conversations/start/', payload);
  return response.data;
};

/**
 * Send a message in an existing conversation
 */
export const sendMessage = async (conversationId: number, content: string): Promise<Message> => {
  const response = await apiClient.post<Message>(
    `/auth/messages/conversations/${conversationId}/send_message/`,
    { content }
  );
  return response.data;
};

/**
 * Mark all messages in a conversation as read
 */
export const markConversationAsRead = async (conversationId: number): Promise<void> => {
  await apiClient.post(`/auth/messages/conversations/${conversationId}/mark_read/`);
};

