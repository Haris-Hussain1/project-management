import api from "../lib/api";

import type { Notification } from "../types";

/* =========================================================
   NOTIFICATION SERVICE
   ========================================================= */

const NOTIFICATIONS_ENDPOINT =
  "/notifications/";

/**
 * Get notifications for the authenticated user.
 *
 * Backend:
 * GET /api/notifications/
 */
export async function getNotifications(): Promise<
  Notification[]
> {
  const response =
    await api.get<Notification[]>(
      NOTIFICATIONS_ENDPOINT,
    );

  return response.data;
}

/**
 * Mark a notification as read.
 *
 * This function assumes the backend notification
 * detail endpoint follows the standard REST pattern:
 *
 * PATCH /api/notifications/:id/
 */
export async function markNotificationAsRead(
  notificationId: number,
): Promise<Notification> {
  const response =
    await api.patch<Notification>(
      `${NOTIFICATIONS_ENDPOINT}${notificationId}/`,
      {
        is_read: true,
      },
    );

  return response.data;
}