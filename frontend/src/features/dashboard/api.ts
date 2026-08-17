import api from "../../lib/api";

import type {
  DashboardNotification,
  DashboardProject,
  DashboardTask,
} from "./types";

export async function getDashboardTasks() {
  const response = await api.get<DashboardTask[]>(
    "/tasks/",
  );

  return response.data;
}

export async function getDashboardProjects() {
  const response = await api.get<DashboardProject[]>(
    "/projects/",
  );

  return response.data;
}

export async function getDashboardNotifications() {
  const response =
    await api.get<DashboardNotification[]>(
      "/notifications/",
    );

  return response.data;
}