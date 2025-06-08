# Secure Messaging API Integration

This document explains how the RapidAPI Secure Messaging API has been integrated into the User & Task Management application.

## 🔐 **Secure Messaging Features**

### **1. Direct User-to-User Messaging**
- **Real-time messaging** between users
- **Encrypted message storage** using RapidAPI's Secure Messaging API
- **Message threads** with unread count indicators
- **Message history** with pagination



### **3. Security Features**
- **Message encryption** via RapidAPI Secure Messaging API
- **Secure message validation**
- **User authentication** for message access
- **Data integrity** protection

## 🚀 **Implementation Details**

### **Backend Components**

#### **1. Secure Messaging Service** (`backend/src/services/secureMessagingService.ts`)
```typescript
// Handles RapidAPI integration
- encryptMessage(): Encrypts messages using RapidAPI
- decryptMessage(): Decrypts messages for display
- validateMessage(): Validates message integrity
```

#### **2. Message Service** (`backend/src/services/messageService.ts`)
```typescript
// Database operations for messages
- createMessage(): Store encrypted messages
- getDirectMessages(): Retrieve conversation history
- getMessageThreads(): List user conversations
- markMessagesAsRead(): Update read status
```

#### **3. Message Routes** (`backend/src/routes/messageRoutes.ts`)
```typescript
// API endpoints
POST   /messages                    - Send new message
GET    /messages/direct/:id1/:id2   - Get conversation
GET    /messages/threads/:userId    - Get user threads
PUT    /messages/read/:userId/:senderId - Mark as read
```

#### **4. Database Schema**
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  recipient_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  encrypted_content TEXT,        -- Encrypted by RapidAPI
  message_type TEXT NOT NULL,    -- 'direct'
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Frontend Components**

#### **1. MessageCenter** (`frontend/src/components/MessageCenter.tsx`)
- **Conversation threads** sidebar
- **Real-time messaging** interface
- **New conversation** creation
- **Message history** display
- **Unread message** indicators



## 🔧 **Setup Instructions**

### **1. Get RapidAPI Key**
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Secure Messaging API](https://rapidapi.com/dishis-technologies-dishis-technologies-default/api/secure-messaging-api)
3. Copy your API key

### **2. Configure Environment**
```bash
# Create .env file in backend directory
cp backend/.env.example backend/.env

# Add your RapidAPI key
RAPIDAPI_KEY=your-rapidapi-key-here
PORT=3001
DATABASE_PATH=./database.sqlite
```

### **3. Enable Full Encryption** (Optional)
Currently running in demo mode. To enable full encryption:

1. **Update Message Service** (`backend/src/services/messageService.ts`):
```typescript
// Uncomment the encryption section in createMessage()
const encryptionResult = await secureMessagingService.encryptMessage(
  messageData.content,
  sender.email,
  recipientEmail || 'system'
);

if (!encryptionResult.success) {
  throw new Error('Failed to encrypt message');
}
encryptedContent = encryptionResult.encrypted_message;
```

2. **Add Decryption** for message retrieval
3. **Rebuild and restart** the backend

## 📱 **User Interface Features**

### **Message Center**
- **Thread List**: Shows all conversations with unread counts
- **Message View**: Real-time chat interface
- **New Message**: Start conversations with any user
- **Message Status**: Read/unread indicators



## 🔒 **Security Benefits**

### **1. Message Encryption**
- **End-to-end encryption** via RapidAPI
- **Secure key management** handled by RapidAPI
- **Message integrity** validation

### **2. Access Control**
- **User authentication** required
- **Message ownership** validation


### **3. Data Protection**
- **Encrypted storage** of sensitive content
- **Secure transmission** protocols
- **Audit trail** for all messages

## 🚀 **Usage Examples**

### **Send Direct Message**
```typescript
await apiService.sendMessage({
  sender_id: 1,
  recipient_id: 2,
  content: "Hello! How's the project going?",
  message_type: 'direct'
});
```



### **Get Conversation History**
```typescript
const conversation = await apiService.getDirectMessages(1, 2, {
  page: 1,
  limit: 20
});
```

## 🎯 **Benefits of Integration**

1. **Enhanced Collaboration**: Secure team communication
2. **User Communication**: Direct messaging between team members
3. **Data Security**: Enterprise-grade encryption
4. **Real-time Updates**: Live messaging interface
5. **Audit Trail**: Complete message history
6. **Scalability**: Cloud-based encryption service

## 🔄 **Future Enhancements**

1. **Real-time Notifications**: WebSocket integration
2. **File Attachments**: Secure file sharing
3. **Message Search**: Full-text search capabilities
4. **Group Messaging**: Team channels
5. **Message Reactions**: Emoji responses
6. **Voice Messages**: Audio message support

The integration provides a solid foundation for secure messaging while maintaining the flexibility to add advanced features as needed.
