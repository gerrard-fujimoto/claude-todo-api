export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  priority?: Priority;
}

export interface ErrorResponse {
  error: string;
}

export interface TodoQueryParams {
  completed?: string;
}

export interface TodoParams {
  id: string;
}
