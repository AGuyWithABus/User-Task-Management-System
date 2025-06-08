export interface Task {
  id?: number;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}
