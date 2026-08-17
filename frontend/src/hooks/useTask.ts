import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getTask,
} from "../services/taskService";

import type {
  Task,
} from "../types";

interface UseTaskResult {
  data: Task | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
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
          };
        };
      }
    ).response;

    if (response?.data?.detail) {
      return response.data.detail;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load the task. Please try again.";
}

export function useTask(
  taskId: number | null,
): UseTaskResult {
  const [data, setData] =
    useState<Task | null>(null);

  const [isLoading, setIsLoading] =
    useState(Boolean(taskId));

  const [error, setError] =
    useState<string | null>(null);

  const loadTask = useCallback(
    async () => {
      if (taskId === null) {
        setData(null);
        setIsLoading(false);
        setError(null);

        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const task =
          await getTask(taskId);

        setData(task);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [taskId],
  );

  useEffect(() => {
    void loadTask();
  }, [loadTask]);

  return {
    data,
    isLoading,
    error,
    refresh: loadTask,
  };
}