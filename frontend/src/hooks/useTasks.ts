import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getTasks,
} from "../services/taskService";

import type {
  Task,
  TaskFilters,
} from "../types";

interface UseTasksResult {
  data: Task[];
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

  return "Unable to load tasks. Please try again.";
}

export function useTasks(
  filters?: TaskFilters,
): UseTasksResult {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const loadTasks = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tasks =
          await getTasks(filters);

        setData(tasks);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [
      filters?.project,
      filters?.status,
      filters?.priority,
      filters?.assigned_to,
    ],
  );

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  return {
    data,
    isLoading,
    error,
    refresh: loadTasks,
  };
}