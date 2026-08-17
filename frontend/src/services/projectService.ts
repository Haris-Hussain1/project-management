import api from "../lib/api";

import type {
  AddProjectMemberRequest,
  Project,
  ProjectMembership,
  UpdateProjectMemberRequest,
  UpdateProjectRequest,
  CreateProjectRequest,
} from "../types";

/* =========================================================
   PROJECT SERVICE
   ========================================================= */

const PROJECTS_ENDPOINT = "/projects/";

/**
 * Get all projects available to the authenticated user.
 *
 * Backend:
 * GET /api/projects/
 */
export async function getProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>(
    PROJECTS_ENDPOINT,
  );

  return response.data;
}

/**
 * Get a single project.
 *
 * Backend:
 * GET /api/projects/:id/
 */
export async function getProject(
  projectId: number,
): Promise<Project> {
  const response = await api.get<Project>(
    `${PROJECTS_ENDPOINT}${projectId}/`,
  );

  return response.data;
}

/**
 * Create a new project.
 *
 * Backend:
 * POST /api/projects/
 */
export async function createProject(
  data: CreateProjectRequest,
): Promise<Project> {
  const response = await api.post<Project>(
    PROJECTS_ENDPOINT,
    data,
  );

  return response.data;
}

/**
 * Update an existing project.
 *
 * Backend:
 * PATCH /api/projects/:id/
 */
export async function updateProject(
  projectId: number,
  data: UpdateProjectRequest,
): Promise<Project> {
  const response = await api.patch<Project>(
    `${PROJECTS_ENDPOINT}${projectId}/`,
    data,
  );

  return response.data;
}

/**
 * Delete a project.
 *
 * Backend:
 * DELETE /api/projects/:id/
 */
export async function deleteProject(
  projectId: number,
): Promise<void> {
  await api.delete(
    `${PROJECTS_ENDPOINT}${projectId}/`,
  );
}

/* =========================================================
   PROJECT MEMBERS
   ========================================================= */

/**
 * Get all members of a project.
 *
 * Backend:
 * GET /api/projects/:id/members/
 */
export async function getProjectMembers(
  projectId: number,
): Promise<ProjectMembership[]> {
  const response =
    await api.get<ProjectMembership[]>(
      `${PROJECTS_ENDPOINT}${projectId}/members/`,
    );

  return response.data;
}

/**
 * Add a member to a project.
 *
 * Backend:
 * POST /api/projects/:id/members/
 */
export async function addProjectMember(
  projectId: number,
  data: AddProjectMemberRequest,
): Promise<ProjectMembership> {
  const response =
    await api.post<ProjectMembership>(
      `${PROJECTS_ENDPOINT}${projectId}/members/`,
      data,
    );

  return response.data;
}

/**
 * Update a project member's role.
 *
 * Backend:
 * PATCH /api/projects/:id/members/:userId/
 */
export async function updateProjectMember(
  projectId: number,
  userId: number,
  data: UpdateProjectMemberRequest,
): Promise<ProjectMembership> {
  const response =
    await api.patch<ProjectMembership>(
      `${PROJECTS_ENDPOINT}${projectId}/members/${userId}/`,
      data,
    );

  return response.data;
}

/**
 * Remove a member from a project.
 *
 * Backend:
 * DELETE /api/projects/:id/members/:userId/
 */
export async function removeProjectMember(
  projectId: number,
  userId: number,
): Promise<void> {
  await api.delete(
    `${PROJECTS_ENDPOINT}${projectId}/members/${userId}/`,
  );
}