export interface Todo {
  id: string;
  todo: string;
  isCompleted?: boolean;
  createdAt?: string;
}

export interface ApiResponse<T> {
  status: boolean | null;
  code: number | null;
  message: string | null;
  timestamp: string | null;
  data: T;
}