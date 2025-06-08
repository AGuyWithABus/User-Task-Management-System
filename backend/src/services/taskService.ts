import sqlite3 from 'sqlite3';
import { database } from '../database/database';
import { Task, CreateTaskRequest } from '../models/Task';
import { promisify } from 'util';

export class TaskService {
  private db = database.getDb();

  async getTasksByUserId(userId: number, options?: {
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'completed' | 'created_at';
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    status?: 'all' | 'completed' | 'pending';
  }): Promise<{ tasks: Task[]; total: number; page: number; totalPages: number }> {
    const all = promisify(this.db.all.bind(this.db)) as (sql: string, params?: any[]) => Promise<any[]>;
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      // Default options
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const sortBy = options?.sortBy || 'created_at';
      const sortOrder = options?.sortOrder || 'DESC';
      const search = options?.search || '';
      const status = options?.status || 'all';

      // Build WHERE clause
      let whereClause = 'WHERE user_id = ?';
      let queryParams: any[] = [userId];

      // Add search filter
      if (search) {
        whereClause += ' AND (title LIKE ? OR description LIKE ?)';
        queryParams.push(`%${search}%`, `%${search}%`);
      }

      // Add status filter
      if (status === 'completed') {
        whereClause += ' AND completed = 1';
      } else if (status === 'pending') {
        whereClause += ' AND completed = 0';
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM tasks ${whereClause}`;
      const countResult = await get(countQuery, queryParams);
      const total = countResult.total;

      // Calculate pagination
      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);

      // Get tasks with pagination and sorting
      const tasksQuery = `
        SELECT * FROM tasks
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
      `;
      const finalParams = [...queryParams, limit, offset];
      const tasks = await all(tasksQuery, finalParams);

      return {
        tasks: tasks as Task[],
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  async createTask(userId: number, taskData: CreateTaskRequest): Promise<Task> {
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      // Check if task with same title already exists for this user
      const existingTask = await get(
        'SELECT id, title FROM tasks WHERE user_id = ? AND LOWER(title) = LOWER(?)',
        [userId, taskData.title]
      );
      if (existingTask) {
        throw new Error(`Task with title "${taskData.title}" already exists for this user`);
      }

      // Insert new task and get the result
      return new Promise((resolve, reject) => {
        this.db.run(
          'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
          [userId, taskData.title, taskData.description || null],
          function(this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              reject(err);
              return;
            }

            // Get the created task using the inserted ID
            const insertId = this.lastID;
            get('SELECT * FROM tasks WHERE id = ?', [insertId])
              .then(task => resolve(task as Task))
              .catch(reject);
          }
        );
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async updateTaskStatus(taskId: number, completed: boolean): Promise<Task | null> {
    const run = promisify(this.db.run.bind(this.db)) as (sql: string, params?: any[]) => Promise<sqlite3.RunResult>;
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      await run('UPDATE tasks SET completed = ? WHERE id = ?', [completed, taskId]);
      const updatedTask = await get('SELECT * FROM tasks WHERE id = ?', [taskId]);
      return updatedTask as Task || null;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }
}

export const taskService = new TaskService();
