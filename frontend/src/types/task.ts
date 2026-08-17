import type { User } from "./auth";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: number;

  project: number;

  title: string;

  description: string;

  status: TaskStatus;

  priority: TaskPriority;

  created_by: User;

  assigned_to: User | null;

  assigned_to_id?: number | null;

  due_date: string | null;

  created_at: string;

  updated_at: string;
}

export interface CreateTaskRequest {
  project: number;

  title: string;

  description?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  assigned_to_id?: number | null;

  due_date?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;

  description?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  assigned_to_id?: number | null;

  due_date?: string | null;
}

export interface TaskFilters {
  project?: number;

  status?: TaskStatus;

  priority?: TaskPriority;

  assigned_to?: number;
}