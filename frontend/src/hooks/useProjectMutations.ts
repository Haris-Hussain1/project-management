import { useCallback, useState } from "react";

import {
  addProjectMember,
  createProject,
  deleteProject,
  removeProjectMember,
  updateProject,
  updateProjectMember,
} from "../services/projectService";

import type {
  AddProjectMemberRequest,
  CreateProjectRequest,
  Project,
  ProjectMembership,
  UpdateProjectMemberRequest,
  UpdateProjectRequest,
} from "../types";

interface UseProjectMutationsResult {
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isUpdatingMember: boolean;
  isAddingMember: boolean;
  isRemovingMember: boolean;
  error: string | null;

  create: (
    data: CreateProjectRequest,
  ) => Promise<Project>;

  update: (
    projectId: number,
    data: UpdateProjectRequest,
  ) => Promise<Project>;

  remove: (
    projectId: number,
  ) => Promise<void>;

  addMember: (
    projectId: number,
    data: AddProjectMemberRequest,
  ) => Promise<ProjectMembership>;

  updateMember: (
    projectId: number,
    userId: number,
    data: UpdateProjectMemberRequest,
  ) => Promise<ProjectMembership>;

  removeMember: (
    projectId: number,
    userId: number,
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

export function useProjectMutations(): UseProjectMutationsResult {
  const [isCreating, setIsCreating] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [isUpdatingMember, setIsUpdatingMember] =
    useState(false);

  const [isAddingMember, setIsAddingMember] =
    useState(false);

  const [isRemovingMember, setIsRemovingMember] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const create = useCallback(
    async (
      data: CreateProjectRequest,
    ): Promise<Project> => {
      setIsCreating(true);
      setError(null);

      try {
        return await createProject(data);
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
      projectId: number,
      data: UpdateProjectRequest,
    ): Promise<Project> => {
      setIsUpdating(true);
      setError(null);

      try {
        return await updateProject(
          projectId,
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
      projectId: number,
    ): Promise<void> => {
      setIsDeleting(true);
      setError(null);

      try {
        await deleteProject(projectId);
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

  const addMember = useCallback(
    async (
      projectId: number,
      data: AddProjectMemberRequest,
    ): Promise<ProjectMembership> => {
      setIsAddingMember(true);
      setError(null);

      try {
        return await addProjectMember(
          projectId,
          data,
        );
      } catch (error) {
        const message =
          getErrorMessage(error);

        setError(message);

        throw error;
      } finally {
        setIsAddingMember(false);
      }
    },
    [],
  );

  const updateMember = useCallback(
    async (
      projectId: number,
      userId: number,
      data: UpdateProjectMemberRequest,
    ): Promise<ProjectMembership> => {
      setIsUpdatingMember(true);
      setError(null);

      try {
        return await updateProjectMember(
          projectId,
          userId,
          data,
        );
      } catch (error) {
        const message =
          getErrorMessage(error);

        setError(message);

        throw error;
      } finally {
        setIsUpdatingMember(false);
      }
    },
    [],
  );

  const removeMember = useCallback(
    async (
      projectId: number,
      userId: number,
    ): Promise<void> => {
      setIsRemovingMember(true);
      setError(null);

      try {
        await removeProjectMember(
          projectId,
          userId,
        );
      } catch (error) {
        const message =
          getErrorMessage(error);

        setError(message);

        throw error;
      } finally {
        setIsRemovingMember(false);
      }
    },
    [],
  );

  return {
    isCreating,
    isUpdating,
    isDeleting,
    isUpdatingMember,
    isAddingMember,
    isRemovingMember,
    error,
    create,
    update,
    remove,
    addMember,
    updateMember,
    removeMember,
    clearError,
  };
}