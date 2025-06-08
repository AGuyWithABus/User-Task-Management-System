import fetch from 'node-fetch';

interface SecureMessageRequest {
  message: string;
  recipient: string;
  sender: string;
}

interface SecureMessageResponse {
  success: boolean;
  encrypted_message?: string;
  message_id?: string;
  error?: string;
}

interface DecryptMessageRequest {
  encrypted_message: string;
  message_id: string;
}

interface DecryptMessageResponse {
  success: boolean;
  decrypted_message?: string;
  error?: string;
}

export class SecureMessagingService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || 'your-rapidapi-key-here';
    this.baseUrl = 'https://secure-messaging-api.p.rapidapi.com';
  }

  async encryptMessage(message: string, sender: string, recipient: string): Promise<SecureMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/encrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'secure-messaging-api.p.rapidapi.com'
        },
        body: JSON.stringify({
          message,
          sender,
          recipient
        })
      });

      const data = await response.json() as SecureMessageResponse;
      return data;
    } catch (error) {
      console.error('Error encrypting message:', error);
      return {
        success: false,
        error: 'Failed to encrypt message'
      };
    }
  }

  async decryptMessage(encryptedMessage: string, messageId: string): Promise<DecryptMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'secure-messaging-api.p.rapidapi.com'
        },
        body: JSON.stringify({
          encrypted_message: encryptedMessage,
          message_id: messageId
        })
      });

      const data = await response.json() as DecryptMessageResponse;
      return data;
    } catch (error) {
      console.error('Error decrypting message:', error);
      return {
        success: false,
        error: 'Failed to decrypt message'
      };
    }
  }

  async validateMessage(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/validate/${messageId}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'secure-messaging-api.p.rapidapi.com'
        }
      });

      const data = await response.json() as { valid: boolean };
      return data.valid;
    } catch (error) {
      console.error('Error validating message:', error);
      return false;
    }
  }
}

export const secureMessagingService = new SecureMessagingService();
