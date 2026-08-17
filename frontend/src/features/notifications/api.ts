import api from "../../lib/api";

import type {
  Notification,
  NotificationUnreadCount,
} from "../../types/notification";

export async function getNotifications(): Promise<
  Notification[]
> {
  const response =
    await api.get<Notification[]>(
      "/notifications/",
    );

  return response.data;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response =
    await api.get<NotificationUnreadCount>(
      "/notifications/unread-count/",
    );

  return response.data.count;
}

export async function getNotification(
  notificationId: number,
): Promise<Notification> {
  const response =
    await api.get<Notification>(
      `/notifications/${notificationId}/`,
    );

  return response.data;
}

export async function markNotificationAsRead(
  notificationId: number,
): Promise<Notification> {
  const response =
    await api.patch<Notification>(
      `/notifications/${notificationId}/`,
      {
        is_read: true,
      },
    );

  return response.data;
}

export async function deleteNotification(
  notificationId: number,
): Promise<void> {
  await api.delete(
    `/notifications/${notificationId}/`,
  );
}

export async function markAllNotificationsAsRead(): Promise<{
  detail: string;
  updated_count: number;
}> {
  const response = await api.post<{
    detail: string;
    updated_count: number;
  }>(
    "/notifications/mark-all-read/",
  );

  return response.data;
}