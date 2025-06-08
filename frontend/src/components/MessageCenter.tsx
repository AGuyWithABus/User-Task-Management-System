import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

interface Message {
  id?: number;
  sender_id: number;
  recipient_id?: number;
  task_id?: number;
  content: string;
  message_type: 'direct' | 'task_comment';
  is_read: boolean;
  created_at?: string;
  sender_name?: string;
  sender_email?: string;
}

interface MessageThread {
  participant_id: number;
  participant_name: string;
  participant_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface MessageCenterProps {
  currentUser: User | null;
  users: User[];
}

const MessageCenter: React.FC<MessageCenterProps> = ({ currentUser, users }) => {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      loadThreads();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedThread && currentUser?.id) {
      loadMessages();
    }
  }, [selectedThread, currentUser]);

  const loadThreads = async () => {
    if (!currentUser?.id) return;
    
    try {
      const fetchedThreads = await apiService.getMessageThreads(currentUser.id);
      setThreads(fetchedThreads);
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const loadMessages = async () => {
    if (!currentUser?.id || !selectedThread) return;
    
    setIsLoading(true);
    try {
      const result = await apiService.getDirectMessages(
        currentUser.id, 
        selectedThread.participant_id,
        { page: 1, limit: 50 }
      );
      setMessages(result.messages.reverse()); // Show oldest first
      
      // Mark messages as read
      await apiService.markMessagesAsRead(currentUser.id, selectedThread.participant_id);
      loadThreads(); // Refresh threads to update unread count
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentUser?.id || !newMessage.trim()) return;
    
    let recipientId = selectedThread?.participant_id;
    if (showNewMessageModal && selectedRecipient) {
      recipientId = selectedRecipient;
    }
    
    if (!recipientId) return;

    try {
      await apiService.sendMessage({
        sender_id: currentUser.id,
        recipient_id: recipientId,
        content: newMessage.trim(),
        message_type: 'direct'
      });
      
      setNewMessage('');
      setShowNewMessageModal(false);
      setSelectedRecipient(null);
      
      // Refresh data
      loadThreads();
      if (selectedThread) {
        loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewConversation = () => {
    setShowNewMessageModal(true);
    setSelectedThread(null);
    setMessages([]);
  };

  if (!currentUser) {
    return (
      <div className="card p-6 text-center">
        <div className="text-4xl mb-4">💬</div>
        <p className="text-gray-600">Please select a user to access messaging</p>
      </div>
    );
  }

  return (
    <div className="message-center-container">
      {/* Threads Sidebar */}
      <div className="message-sidebar">
        <div className="message-sidebar-header">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💬</span>
            <h4 className="font-semibold text-gray-900">Messages</h4>
          </div>
          <button
            type="button"
            onClick={startNewConversation}
            className="btn btn-primary w-full"
          >
            ✉️ New Message
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-4 text-center">
              <div className="text-2xl mb-2">📭</div>
              <p className="text-gray-600 text-sm">No conversations yet</p>
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.participant_id}
                onClick={() => setSelectedThread(thread)}
                className={`message-thread ${
                  selectedThread?.participant_id === thread.participant_id ? 'message-thread-selected' : ''
                }`}
              >
                <div className="message-thread-content">
                  <strong className="text-gray-900">{thread.participant_name}</strong>
                  {thread.unread_count > 0 && (
                    <span className="unread-badge">
                      {thread.unread_count}
                    </span>
                  )}
                </div>
                <p className="message-preview">
                  {thread.last_message}
                </p>
                <small className="text-xs text-gray-500">
                  {new Date(thread.last_message_time).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="message-area">
        {showNewMessageModal ? (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✉️</span>
              <h4 className="text-lg font-semibold text-gray-900">New Message</h4>
            </div>
            <div className="form-group">
              <label htmlFor="recipient-select" className="form-label">To:</label>
              <select
                id="recipient-select"
                value={selectedRecipient || ''}
                onChange={(e) => setSelectedRecipient(parseInt(e.target.value))}
                className="form-select"
              >
                <option value="">Select a user...</option>
                {users.filter(u => u.id !== currentUser.id).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="form-textarea"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={sendMessage}
                disabled={!selectedRecipient || !newMessage.trim()}
                className="btn btn-primary"
              >
                📤 Send
              </button>
              <button
                type="button"
                onClick={() => setShowNewMessageModal(false)}
                className="btn btn-secondary"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : selectedThread ? (
          <>
            {/* Messages Header */}
            <div className="message-header">
              <h4 className="font-semibold text-gray-900 mb-1">{selectedThread.participant_name}</h4>
              <small className="text-gray-600">{selectedThread.participant_email}</small>
            </div>

            {/* Messages List */}
            <div className="messages-list">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-gray-600">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-bubble ${
                      message.sender_id === currentUser.id ? 'message-bubble-sent' : 'message-bubble-received'
                    }`}
                  >
                    <div
                      className={`message-content ${
                        message.sender_id === currentUser.id ? 'message-content-sent' : 'message-content-received'
                      }`}
                    >
                      <p className="mb-1">{message.content}</p>
                      <small className="text-xs opacity-80">
                        {message.created_at ? new Date(message.created_at).toLocaleString() : ''}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              <div className="message-input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="message-input"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="btn btn-primary message-send-btn"
                >
                  📤
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <div className="text-4xl mb-4">💬</div>
              <p className="text-gray-600">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;
