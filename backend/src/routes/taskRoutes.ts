import { Router, Request, Response, RequestHandler } from 'express';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import { CreateTaskRequest } from '../models/Task';

const router = Router();

// GET /users/:id/tasks - List all tasks for a specific user with pagination, sorting, and filtering
const getUserTasks: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    // Check if user exists
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'created_at';
    const sortOrder = (req.query.sortOrder as string)?.toUpperCase() as 'ASC' | 'DESC' || 'DESC';
    const search = req.query.search as string || '';
    const status = (req.query.status as string) || 'all';

    // Validate sortBy
    const validSortFields = ['title', 'completed', 'created_at'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy as 'title' | 'completed' | 'created_at' : 'created_at';

    // Validate sortOrder
    const finalSortOrder = ['ASC', 'DESC'].includes(sortOrder) ? sortOrder : 'DESC';

    // Validate status
    const validStatuses = ['all', 'completed', 'pending'];
    const finalStatus = validStatuses.includes(status) ? status as 'all' | 'completed' | 'pending' : 'all';

    const result = await taskService.getTasksByUserId(userId, {
      page,
      limit: Math.min(limit, 100), // Max 100 items per page
      sortBy: finalSortBy,
      sortOrder: finalSortOrder,
      search,
      status: finalStatus
    });

    res.json(result);
  } catch (error) {
    console.error('Error in GET /users/:id/tasks:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
};

// POST /users/:id/tasks - Create a new task for a user
const createUserTask: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const taskData: CreateTaskRequest = req.body;

    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    // Basic validation
    if (!taskData.title) {
      res.status(400).json({ error: 'Task title is required' });
      return;
    }

    // Check if user exists
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const newTask = await taskService.createTask(userId, taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error in POST /users/:id/tasks:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
};

router.get('/:id/tasks', getUserTasks);
router.post('/:id/tasks', createUserTask);

export default router;
