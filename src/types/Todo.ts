export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: string; // ISO date string (YYYY-MM-DD) - NOTE: Will be persisted automatically when AIADT-10 merges
}
