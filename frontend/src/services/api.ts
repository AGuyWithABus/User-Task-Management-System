const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://user-task-management-system-backend.onrender.com';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  async getUsers(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options?.search) params.append('search', options.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';

    return this.request<any>(endpoint);
  }

  async createUser(userData: any): Promise<any> {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Task endpoints
  async getUserTasks(userId: number, options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    status?: string;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options?.search) params.append('search', options.search);
    if (options?.status) params.append('status', options.status);

    const queryString = params.toString();
    const endpoint = queryString ? `/users/${userId}/tasks?${queryString}` : `/users/${userId}/tasks`;

    return this.request<any>(endpoint);
  }

  async createTask(userId: number, taskData: any): Promise<any> {
    return this.request<any>(`/users/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  // Message endpoints
  async sendMessage(messageData: {
    sender_id: number;
    recipient_id: number;
    content: string;
    message_type: 'direct';
  }): Promise<any> {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async getDirectMessages(userId1: number, userId2: number, options?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ?
      `/messages/direct/${userId1}/${userId2}?${queryString}` :
      `/messages/direct/${userId1}/${userId2}`;

    return this.request<any>(endpoint);
  }



  async getMessageThreads(userId: number): Promise<any> {
    return this.request<any>(`/messages/threads/${userId}`);
  }

  async markMessagesAsRead(userId: number, senderId: number): Promise<any> {
    return this.request<any>(`/messages/read/${userId}/${senderId}`, {
      method: 'PUT'
    });
  }
}

export const apiService = new ApiService();
