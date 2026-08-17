import { useCallback, useState } from "react";

import {
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";

import type {
  CreateTaskRequest,
  Task,
  UpdateTaskRequest,
} from "../types";

interface UseTaskMutationsResult {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;

  create: (
    data: CreateTaskRequest,
  ) => Promise<Task>;

  update: (
    taskId: number,
    data: UpdateTaskRequest,
  ) => Promise<Task>;

  remove: (
    taskId: number,
  ) => Promise<void>;

  clearError: () => void;
}

function getErrorMessage(
  error: unknown,
): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            detail?: string;
            [key: string]: unknown;
          };
        };
      }
    ).response;

    if (response?.data?.detail) {
      return response.data.detail;
    }

    if (response?.data) {
      const values = Object.values(
        response.data,
      );

      for (const value of values) {
        if (typeof value === "string") {
          return value;
        }

        if (Array.isArray(value)) {
          const message = value.find(
            (item) => typeof item === "string",
          );

          if (typeof message === "string") {
            return message;
          }
        }
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function useTaskMutations(): UseTaskMutationsResult {
  const [isCreating, setIsCreating] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const create = useCallback(
    async (
      data: CreateTaskRequest,
    ): Promise<Task> => {
      setIsCreating(true);
      setError(null);

      try {
        return await createTask(data);
      } catch (error) {
        const message =
          getErrorMessage(error);

        setError(message);

        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      taskId: number,
      data: UpdateTaskRequest,
    ): Promise<Task> => {
      setIsUpdating(true);
      setError(null);

      try {
        return await updateTask(
          taskId,
          data,
        );
      } catch (error) {
        const message =
          getErrorMessage(error);

        setError(message);

        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [],
  );

  const remove = useCallback(
    async (
      taskId: number,
    ): Promise<void> => {
      setIsDeleting(true);
      setError(null);

      try {
        await deleteTask(taskId);
      } catch (error) {
        const message =
          getErrorMessage(error);

        setError(message);

        throw error;
      } finally {
        setIsDeleting(false);
      }
    },
    [],
  );

  return {
    isCreating,
    isUpdating,
    isDeleting,
    error,
    create,
    update,
    remove,
    clearError,
  };
}