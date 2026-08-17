import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

import type {
  Notification,
} from "../types";

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchNotifications =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data =
          await getNotifications();

        setNotifications(data);
      } catch (err) {
        console.error(
          "Failed to fetch notifications:",
          err,
        );

        setError(
          "Unable to load notifications.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead =
    useCallback(
      async (
        notificationId: number,
      ): Promise<Notification> => {
        const updated =
          await markNotificationAsRead(
            notificationId,
          );

        setNotifications((current) =>
          current.map((item) =>
            item.id ===
            notificationId
              ? updated
              : item,
          ),
        );

        return updated;
      },
      [],
    );

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.is_read,
    ).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
  };
}