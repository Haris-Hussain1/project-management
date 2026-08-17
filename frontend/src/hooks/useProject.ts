import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getProject } from "../services/projectService";

import type { Project } from "../types";

interface UseProjectResult {
  data: Project | null;
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

  return "Unable to load the project. Please try again.";
}

export function useProject(
  projectId: number | null,
): UseProjectResult {
  const [data, setData] =
    useState<Project | null>(null);

  const [isLoading, setIsLoading] =
    useState(Boolean(projectId));

  const [error, setError] =
    useState<string | null>(null);

  const loadProject = useCallback(
    async () => {
      if (!projectId) {
        setData(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const project =
          await getProject(projectId);

        setData(project);
      } catch (error) {
        setError(getErrorMessage(error));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [projectId],
  );

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  return {
    data,
    isLoading,
    error,
    refresh: loadProject,
  };
}