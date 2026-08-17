import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProjects,
} from "../services/projectService";

import type {
  Project,
} from "../types";

interface UseProjectsResult {
  data: Project[];
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

  return "Unable to load projects. Please try again.";
}

export function useProjects(): UseProjectsResult {
  const [data, setData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const loadProjects = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const projects = await getProjects();

        setData(projects);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return {
    data,
    isLoading,
    error,
    refresh: loadProjects,
  };
}