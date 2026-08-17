import type { User } from "./auth";

export interface Comment {
  id: number;

  author: User;

  content: string;

  created_at: string;

  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}