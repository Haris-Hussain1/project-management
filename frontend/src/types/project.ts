import type { User } from "./auth";

export type ProjectStatus =
  | "active"
  | "archived";

export type ProjectRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer";

export interface ProjectMember {
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
  members: ProjectMember[];
  created_at: string;
  updated_at: string;
}

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