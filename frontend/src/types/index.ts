export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
}

/* =========================================================
   PROJECTS
   ========================================================= */

export type ProjectStatus = "active" | "archived";

export type ProjectRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export interface ProjectMembership {
  id: number;
  user: User;
  role: ProjectRole;
  joined_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  owner: User;
  members: ProjectMembership[];
  created_at: string;
  updated_at: string;
}

/* =========================================================
   PROJECT REQUEST TYPES
   ========================================================= */

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface AddProjectMemberRequest {
  user_id: number;
  role?: Exclude<ProjectRole, "owner">;
}

export interface UpdateProjectMemberRequest {
  role: Exclude<ProjectRole, "owner">;
}

/* =========================================================
   TASKS
   ========================================================= */

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
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

/* =========================================================
   TASK REQUEST TYPES
   ========================================================= */

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
  project?: number;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to_id?: number | null;
  due_date?: string | null;
}

/* =========================================================
   TASK FILTERS
   ========================================================= */

export interface TaskFilters {
  project?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: number;
}

/* =========================================================
   COMMENTS
   ========================================================= */

export interface Comment {
  id: number;
  content: string;
  author: User;
  task: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

export type NotificationType = string;

export interface Notification {
  id: number;
  notification_type: NotificationType;
  title: string;
  message: string;
  project: number | null;
  task: number | null;
  is_read: boolean;
  created_at: string;
}

/* =========================================================
   COMMON API TYPES
   ========================================================= */

export interface ApiError {
  detail?: string;
  [field: string]: unknown;
}