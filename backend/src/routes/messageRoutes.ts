import { Router, Request, Response, RequestHandler } from 'express';
import { createMessageService } from '../services/messageService';
import { database } from '../database/database';
import { CreateMessageRequest } from '../models/Message';

const router = Router();
const messageService = createMessageService(database.getDb());

// POST /messages - Send a new message
const sendMessage: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { sender_id, recipient_id, content, message_type } = req.body;

    if (!sender_id || !content || !message_type) {
      res.status(400).json({ error: 'sender_id, content, and message_type are required' });
      return;
    }

    if (message_type === 'direct' && !recipient_id) {
      res.status(400).json({ error: 'recipient_id is required for direct messages' });
      return;
    }



    const messageData: CreateMessageRequest = {
      recipient_id,
      content,
      message_type: message_type as 'direct'
    };

    const message = await messageService.createMessage(sender_id, messageData);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error in POST /messages:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
};

// GET /messages/direct/:userId1/:userId2 - Get direct messages between two users
const getDirectMessages: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId1 = parseInt(req.params.userId1);
    const userId2 = parseInt(req.params.userId2);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (isNaN(userId1) || isNaN(userId2)) {
      res.status(400).json({ error: 'Invalid user IDs' });
      return;
    }

    const result = await messageService.getDirectMessages(userId1, userId2, {
      page,
      limit: Math.min(limit, 100)
    });

    res.json(result);
  } catch (error) {
    console.error('Error in GET /messages/direct:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
};



// GET /messages/threads/:userId - Get message threads for a user
const getMessageThreads: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const threads = await messageService.getMessageThreads(userId);
    res.json(threads);
  } catch (error) {
    console.error('Error in GET /messages/threads:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
};

// PUT /messages/read/:userId/:senderId - Mark messages as read
const markMessagesAsRead: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const senderId = parseInt(req.params.senderId);

    if (isNaN(userId) || isNaN(senderId)) {
      res.status(400).json({ error: 'Invalid user IDs' });
      return;
    }

    await messageService.markMessagesAsRead(userId, senderId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /messages/read:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
};

// Register routes
router.post('/', sendMessage);
router.get('/direct/:userId1/:userId2', getDirectMessages);
router.get('/threads/:userId', getMessageThreads);
router.put('/read/:userId/:senderId', markMessagesAsRead);

export default router;
