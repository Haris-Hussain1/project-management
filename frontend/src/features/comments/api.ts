import api from "../../lib/api";

import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../../types";

export async function getComments(
  projectId: number,
  taskId: number,
): Promise<Comment[]> {
  const response = await api.get<Comment[]>(
    `/comments/projects/${projectId}/tasks/${taskId}/comments/`,
  );

  return response.data;
}

export async function createComment(
  projectId: number,
  taskId: number,
  data: CreateCommentRequest,
): Promise<Comment> {
  const response = await api.post<Comment>(
    `/comments/projects/${projectId}/tasks/${taskId}/comments/`,
    data,
  );

  return response.data;
}

export async function updateComment(
  projectId: number,
  taskId: number,
  commentId: number,
  data: UpdateCommentRequest,
): Promise<Comment> {
  const response = await api.patch<Comment>(
    `/comments/projects/${projectId}/tasks/${taskId}/comments/${commentId}/`,
    data,
  );

  return response.data;
}

export async function deleteComment(
  projectId: number,
  taskId: number,
  commentId: number,
): Promise<void> {
  await api.delete(
    `/comments/projects/${projectId}/tasks/${taskId}/comments/${commentId}/`,
  );
}