import api from "../lib/api";

import type {
  CreateTaskRequest,
  Task,
  TaskFilters,
  UpdateTaskRequest,
} from "../types";

/* =========================================================
   TASK SERVICE
   ========================================================= */

const TASKS_ENDPOINT = "/tasks/";

/**
 * Get tasks available to the authenticated user.
 *
 * Supported backend filters:
 *
 * ?project=
 * ?status=
 * ?priority=
 * ?assigned_to=
 *
 * Backend:
 * GET /api/tasks/
 */
export async function getTasks(
  filters?: TaskFilters,
): Promise<Task[]> {
  const response = await api.get<Task[]>(
    TASKS_ENDPOINT,
    {
      params: filters,
    },
  );

  return response.data;
}

/**
 * Get a single task.
 *
 * Backend:
 * GET /api/tasks/:id/
 */
export async function getTask(
  taskId: number,
): Promise<Task> {
  const response = await api.get<Task>(
    `${TASKS_ENDPOINT}${taskId}/`,
  );

  return response.data;
}

/**
 * Create a task.
 *
 * Backend:
 * POST /api/tasks/
 */
export async function createTask(
  data: CreateTaskRequest,
): Promise<Task> {
  const response = await api.post<Task>(
    TASKS_ENDPOINT,
    data,
  );

  return response.data;
}

/**
 * Update a task.
 *
 * Backend:
 * PATCH /api/tasks/:id/
 */
export async function updateTask(
  taskId: number,
  data: UpdateTaskRequest,
): Promise<Task> {
  const response = await api.patch<Task>(
    `${TASKS_ENDPOINT}${taskId}/`,
    data,
  );

  return response.data;
}

/**
 * Delete a task.
 *
 * Backend:
 * DELETE /api/tasks/:id/
 */
export async function deleteTask(
  taskId: number,
): Promise<void> {
  await api.delete(
    `${TASKS_ENDPOINT}${taskId}/`,
  );
}