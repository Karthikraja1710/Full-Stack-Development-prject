export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string | null;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
}

export interface TaskFiltersState {
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
