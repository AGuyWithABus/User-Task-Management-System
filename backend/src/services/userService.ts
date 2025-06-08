import sqlite3 from 'sqlite3';
import { database } from '../database/database';
import { User, CreateUserRequest } from '../models/User';
import { promisify } from 'util';

export class UserService {
  private db = database.getDb();

  async getAllUsers(options?: {
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'email' | 'created_at';
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const all = promisify(this.db.all.bind(this.db)) as (sql: string, params?: any[]) => Promise<any[]>;
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      // Default options
      const page = options?.page || 1;
      const limit = options?.limit || 10;
      const sortBy = options?.sortBy || 'created_at';
      const sortOrder = options?.sortOrder || 'DESC';
      const search = options?.search || '';

      // Build WHERE clause for search
      let whereClause = '';
      let searchParams: any[] = [];
      if (search) {
        whereClause = 'WHERE name LIKE ? OR email LIKE ?';
        searchParams = [`%${search}%`, `%${search}%`];
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
      const countResult = await get(countQuery, searchParams);
      const total = countResult.total;

      // Calculate pagination
      const offset = (page - 1) * limit;
      const totalPages = Math.ceil(total / limit);

      // Get users with pagination and sorting
      const usersQuery = `
        SELECT * FROM users
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ? OFFSET ?
      `;
      const queryParams = [...searchParams, limit, offset];
      const users = await all(usersQuery, queryParams);

      return {
        users: users as User[],
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      // Check if email already exists
      const existingUser = await get('SELECT id, name FROM users WHERE email = ?', [userData.email]);
      if (existingUser) {
        throw new Error(`User with email "${userData.email}" already exists (Name: ${existingUser.name})`);
      }

      // Insert new user and get the result
      return new Promise((resolve, reject) => {
        this.db.run(
          'INSERT INTO users (name, email) VALUES (?, ?)',
          [userData.name, userData.email],
          function(this: sqlite3.RunResult, err: Error | null) {
            if (err) {
              reject(err);
              return;
            }

            // Get the created user using the inserted ID
            const insertId = this.lastID;
            get('SELECT * FROM users WHERE id = ?', [insertId])
              .then(user => resolve(user as User))
              .catch(reject);
          }
        );
      });
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create user');
    }
  }

  async getUserById(id: number): Promise<User | null> {
    const get = promisify(this.db.get.bind(this.db)) as (sql: string, params?: any[]) => Promise<any>;

    try {
      const user = await get('SELECT * FROM users WHERE id = ?', [id]);
      return user as User || null;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw new Error('Failed to fetch user');
    }
  }
}

export const userService = new UserService();
