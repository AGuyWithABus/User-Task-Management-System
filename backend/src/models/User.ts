export interface User {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}
