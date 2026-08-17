import api from "../../lib/api";

import type {
  CreateTaskRequest,
  Task,
  TaskFilters,
  UpdateTaskRequest,
} from "../../types/task";

export async function getTasks(
  filters?: TaskFilters,
): Promise<Task[]> {
  const response = await api.get<Task[]>(
    "/tasks/",
    {
      params: filters,
    },
  );

  return response.data;
}

export async function getTask(
  taskId: number,
): Promise<Task> {
  const response = await api.get<Task>(
    `/tasks/${taskId}/`,
  );

  return response.data;
}

export async function createTask(
  data: CreateTaskRequest,
): Promise<Task> {
  const response = await api.post<Task>(
    "/tasks/",
    data,
  );

  return response.data;
}

export async function updateTask(
  taskId: number,
  data: UpdateTaskRequest,
): Promise<Task> {
  const response = await api.patch<Task>(
    `/tasks/${taskId}/`,
    data,
  );

  return response.data;
}

export async function deleteTask(
  taskId: number,
): Promise<void> {
  await api.delete(
    `/tasks/${taskId}/`,
  );
}