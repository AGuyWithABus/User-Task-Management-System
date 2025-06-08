import { Router, Request, Response, RequestHandler } from 'express';
import { userService } from '../services/userService';
import { CreateUserRequest } from '../models/User';

const router = Router();

// GET /users - List all users with pagination, sorting, and filtering
const getUsers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'created_at';
    const sortOrder = (req.query.sortOrder as string)?.toUpperCase() as 'ASC' | 'DESC' || 'DESC';
    const search = req.query.search as string || '';

    // Validate sortBy
    const validSortFields = ['name', 'email', 'created_at'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy as 'name' | 'email' | 'created_at' : 'created_at';

    // Validate sortOrder
    const finalSortOrder = ['ASC', 'DESC'].includes(sortOrder) ? sortOrder : 'DESC';

    const result = await userService.getAllUsers({
      page,
      limit: Math.min(limit, 100), // Max 100 items per page
      sortBy: finalSortBy,
      sortOrder: finalSortOrder,
      search
    });

    res.json(result);
  } catch (error) {
    console.error('Error in GET /users:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
};

// POST /users - Create a new user
const createUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;

    // Basic validation
    if (!userData.name || !userData.email) {
      res.status(400).json({
        error: 'Name and email are required'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      res.status(400).json({
        error: 'Invalid email format'
      });
      return;
    }

    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in POST /users:', error);
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
};

router.get('/', getUsers);
router.post('/', createUser);

export default router;
