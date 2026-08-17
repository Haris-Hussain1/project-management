import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getDashboardNotifications,
  getDashboardProjects,
  getDashboardTasks,
} from "./api";

import type {
  DashboardData,
} from "./types";

interface UseDashboardResult {
  data: DashboardData;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const emptyData: DashboardData = {
  stats: {
    total_projects: 0,
    total_tasks: 0,
    in_progress_tasks: 0,
    completed_tasks: 0,
    overdue_tasks: 0,
  },
  tasks: [],
  projects: [],
  notifications: [],
};

export function useDashboard(): UseDashboardResult {
  const [data, setData] =
    useState<DashboardData>(emptyData);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDashboard = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [
          tasks,
          projects,
          notifications,
        ] = await Promise.all([
          getDashboardTasks(),
          getDashboardProjects(),
          getDashboardNotifications(),
        ]);

        const now = new Date();

        const completedTasks =
          tasks.filter(
            (task) =>
              task.status.toLowerCase() ===
              "completed",
          ).length;

        const inProgressTasks =
          tasks.filter(
            (task) =>
              task.status.toLowerCase() ===
              "in_progress",
          ).length;

        const overdueTasks =
          tasks.filter((task) => {
            if (!task.due_date) {
              return false;
            }

            const dueDate =
              new Date(task.due_date);

            return (
              dueDate < now &&
              task.status.toLowerCase() !==
                "completed"
            );
          }).length;

        setData({
          stats: {
            total_projects:
              projects.length,

            total_tasks:
              tasks.length,

            in_progress_tasks:
              inProgressTasks,

            completed_tasks:
              completedTasks,

            overdue_tasks:
              overdueTasks,
          },

          tasks,
          projects,
          notifications,
        });
      } catch {
        setError(
          "Unable to load your dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    data,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}