import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { Message, CreateMessageRequest, MessageThread } from '../models/Message';
import { secureMessagingService } from './secureMessagingService';

export class MessageService {
  private db: sqlite3.Database;

  constructor(database: sqlite3.Database) {
    this.db = database;
  }

  async createMessage(senderId: number, messageData: CreateMessageRequest): Promise<Message> {
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      // Get sender info for encryption
      const sender = await get('SELECT email FROM users WHERE id = ?', [senderId]);
      if (!sender) {
        throw new Error('Sender not found');
      }

      let recipientEmail = '';
      if (messageData.recipient_id) {
        const recipient = await get('SELECT email FROM users WHERE id = ?', [messageData.recipient_id]);
        if (!recipient) {
          throw new Error('Recipient not found');
        }
        recipientEmail = recipient.email;
      }

      // For demo purposes, we'll store the message as-is
      // In production, you would use the Secure Messaging API here
      let encryptedContent = null;

      // Uncomment this section when you have a valid RapidAPI key:
      /*
      const encryptionResult = await secureMessagingService.encryptMessage(
        messageData.content,
        sender.email,
        recipientEmail || 'system'
      );

      if (!encryptionResult.success) {
        throw new Error('Failed to encrypt message');
      }
      encryptedContent = encryptionResult.encrypted_message;
      */

      // Insert message into database
      return new Promise((resolve, reject) => {
        this.db.run(
          `INSERT INTO messages (sender_id, recipient_id, content, encrypted_content, message_type, is_read)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            senderId,
            messageData.recipient_id,
            messageData.content,
            encryptedContent,
            messageData.message_type,
            false
          ],
          function(this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              reject(err);
              return;
            }
            
            const insertId = this.lastID;
            get('SELECT * FROM messages WHERE id = ?', [insertId])
              .then(message => resolve(message as Message))
              .catch(reject);
          }
        );
      });
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to create message');
    }
  }

  async getDirectMessages(userId1: number, userId2: number, options?: {
    page?: number;
    limit?: number;
  }): Promise<{ messages: Message[]; total: number; page: number; totalPages: number }> {
    const all = promisify(this.db.all.bind(this.db)) as (sql: string, params?: any[]) => Promise<any[]>;
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      const page = options?.page || 1;
      const limit = options?.limit || 20;
      const offset = (page - 1) * limit;

      // Get total count
      const countResult = await get(
        `SELECT COUNT(*) as total FROM messages 
         WHERE message_type = 'direct' 
         AND ((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?))`,
        [userId1, userId2, userId2, userId1]
      );

      const total = countResult.total;
      const totalPages = Math.ceil(total / limit);

      // Get messages
      const messages = await all(
        `SELECT m.*, 
                u1.name as sender_name, u1.email as sender_email,
                u2.name as recipient_name, u2.email as recipient_email
         FROM messages m
         LEFT JOIN users u1 ON m.sender_id = u1.id
         LEFT JOIN users u2 ON m.recipient_id = u2.id
         WHERE m.message_type = 'direct' 
         AND ((m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?))
         ORDER BY m.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId1, userId2, userId2, userId1, limit, offset]
      );

      return {
        messages: messages as Message[],
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching direct messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }



  async getMessageThreads(userId: number): Promise<MessageThread[]> {
    const all = promisify(this.db.all.bind(this.db)) as (sql: string, params?: any[]) => Promise<any[]>;

    try {
      const threads = await all(
        `SELECT 
           CASE 
             WHEN m.sender_id = ? THEN m.recipient_id 
             ELSE m.sender_id 
           END as participant_id,
           u.name as participant_name,
           u.email as participant_email,
           m.content as last_message,
           m.created_at as last_message_time,
           COUNT(CASE WHEN m.recipient_id = ? AND m.is_read = 0 THEN 1 END) as unread_count
         FROM messages m
         LEFT JOIN users u ON u.id = CASE 
           WHEN m.sender_id = ? THEN m.recipient_id 
           ELSE m.sender_id 
         END
         WHERE (m.sender_id = ? OR m.recipient_id = ?) 
         AND m.message_type = 'direct'
         GROUP BY participant_id
         ORDER BY m.created_at DESC`,
        [userId, userId, userId, userId, userId]
      );

      return threads as MessageThread[];
    } catch (error) {
      console.error('Error fetching message threads:', error);
      throw new Error('Failed to fetch message threads');
    }
  }

  async markMessagesAsRead(userId: number, senderId: number): Promise<void> {
    const run = promisify(this.db.run.bind(this.db)) as (sql: string, params?: any[]) => Promise<sqlite3.RunResult>;

    try {
      await run(
        'UPDATE messages SET is_read = 1 WHERE recipient_id = ? AND sender_id = ? AND is_read = 0',
        [userId, senderId]
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }
}

export const createMessageService = (database: sqlite3.Database) => new MessageService(database);
