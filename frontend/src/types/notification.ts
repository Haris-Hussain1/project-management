export type NotificationType =
  | "project_invitation"
  | "project_member_added"
  | "project_member_removed"
  | "task_assigned"
  | "task_status_changed"
  | "comment_added";

export interface Notification {
  id: number;

  recipient: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    email: string;
    avatar?: string | null;
  };

  notification_type: NotificationType;

  title: string;

  message: string;

  project: number | null;

  task: number | null;

  is_read: boolean;

  created_at: string;
}

export interface NotificationUnreadCount {
  count: number;
}

export interface NotificationReadRequest {
  is_read: boolean;
}