export interface Message {
  id?: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  encrypted_content?: string;
  message_type: 'direct';
  is_read: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMessageRequest {
  recipient_id: number;
  content: string;
  message_type: 'direct';
}

export interface MessageThread {
  participant_id: number;
  participant_name: string;
  participant_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}
