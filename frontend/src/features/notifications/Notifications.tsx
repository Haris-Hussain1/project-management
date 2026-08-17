import {
  AlertCircle,
  Bell,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import { useNotifications } from "../../hooks/useNotifications";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function notificationTypeLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function notificationTypeClass(value: string): string {
  const type = value.toLowerCase();

  if (
    type.includes("task") ||
    type.includes("assignment")
  ) {
    return "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100";
  }

  if (
    type.includes("project") ||
    type.includes("member")
  ) {
    return "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100";
  }

  if (
    type.includes("comment") ||
    type.includes("message")
  ) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100";
  }

  if (
    type.includes("deadline") ||
    type.includes("overdue")
  ) {
    return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100";
  }

  return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
}

function NotificationSkeleton() {
  return (
    <div className="animate-pulse px-5 py-5 sm:px-6">
      <div className="flex gap-4">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="h-4 w-1/3 rounded bg-slate-100" />
            <div className="h-6 w-20 rounded-full bg-slate-100" />
          </div>

          <div className="mt-3 h-3 w-4/5 rounded bg-slate-100" />
          <div className="mt-2 h-3 w-3/5 rounded bg-slate-100" />

          <div className="mt-4 h-3 w-1/4 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon: Icon,
  emphasized = false,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof Bell;
  emphasized?: boolean;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
            emphasized
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white",
          ].join(" ")}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
  } = useNotifications();

  const [filter, setFilter] =
    useState<"all" | "unread">("all");

  const [markingId, setMarkingId] =
    useState<number | null>(null);

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter(
        (notification) => !notification.is_read,
      );
    }

    return notifications;
  }, [filter, notifications]);

  const handleMarkAsRead = async (
    notificationId: number,
  ) => {
    setMarkingId(notificationId);

    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err,
      );
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <section className="pb-8">
      {/* Page header */}
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Bell size={15} strokeWidth={1.9} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Workspace
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Notifications
            </h1>

            {!isLoading && unreadCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                {unreadCount} unread
              </span>
            )}
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep track of project updates, task
            activity, comments, and other workspace
            events.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchNotifications()}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
        >
          <RefreshCw
            size={15}
            className={
              isLoading ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total notifications"
          value={isLoading ? "—" : notifications.length}
          description="Workspace activity"
          icon={Bell}
        />

        <SummaryCard
          label="Unread"
          value={isLoading ? "—" : unreadCount}
          description="Notifications needing attention"
          icon={Bell}
          emphasized
        />

        <SummaryCard
          label="Read"
          value={
            isLoading
              ? "—"
              : notifications.length - unreadCount
          }
          description="Previously reviewed"
          icon={Check}
        />
      </div>

      {/* Controls */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="inline-flex w-fit rounded-xl bg-slate-100 p-1"
            role="tablist"
            aria-label="Notification filter"
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-selected={filter === "all"}
              className={[
                "rounded-lg px-4 py-2 text-xs font-semibold transition",
                filter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              aria-selected={filter === "unread"}
              className={[
                "rounded-lg px-4 py-2 text-xs font-semibold transition",
                filter === "unread"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              Unread

              {!isLoading && unreadCount > 0 && (
                <span className="ml-1.5 text-slate-400">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <p className="px-1 text-xs font-medium text-slate-400">
            {isLoading
              ? "Loading notifications..."
              : `${filteredNotifications.length} ${
                  filteredNotifications.length === 1
                    ? "notification"
                    : "notifications"
                }`}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertCircle
                size={17}
                className="text-red-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load notifications
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchNotifications()}
            className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {/* Notification list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Activity
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Your latest workspace events
            </p>
          </div>

          {!isLoading && unreadCount > 0 && (
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              {unreadCount} waiting for review
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((item) => (
              <NotificationSkeleton key={item} />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
              <Bell size={23} strokeWidth={1.7} />
            </div>

            <h2 className="mt-5 text-sm font-semibold text-slate-800">
              {filter === "unread"
                ? "You're all caught up"
                : "No notifications yet"}
            </h2>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
              {filter === "unread"
                ? "There are no unread notifications right now."
                : "Workspace activity and updates will appear here."}
            </p>

            {filter === "unread" &&
              notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="mt-4 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  View all notifications
                </button>
              )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map(
              (notification) => (
                <article
                  key={notification.id}
                  className={[
                    "group px-5 py-5 transition duration-150 sm:px-6 sm:py-6",
                    notification.is_read
                      ? "bg-white hover:bg-slate-50/60"
                      : "bg-slate-50/60 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="flex gap-4">
                    <div
                      className={[
                        "relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition",
                        notification.is_read
                          ? "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                          : "bg-slate-900 text-white shadow-sm",
                      ].join(" ")}
                    >
                      <Bell
                        size={17}
                        strokeWidth={1.8}
                      />

                      {!notification.is_read && (
                        <span
                          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-900"
                          aria-label="Unread"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2
                              className={[
                                "text-sm",
                                notification.is_read
                                  ? "font-medium text-slate-700"
                                  : "font-semibold text-slate-900",
                              ].join(" ")}
                            >
                              {notification.title}
                            </h2>
                          </div>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {formatDate(
                              notification.created_at,
                            )}
                          </p>
                        </div>

                        <span
                          className={[
                            "w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                            notificationTypeClass(
                              notification.notification_type,
                            ),
                          ].join(" ")}
                        >
                          {notificationTypeLabel(
                            notification.notification_type,
                          )}
                        </span>
                      </div>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                        {notification.message}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {notification.project !== null && (
                          <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                            Project #{notification.project}
                          </span>
                        )}

                        {notification.task !== null && (
                          <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-500">
                            Task #{notification.task}
                          </span>
                        )}

                        {!notification.is_read && (
                          <button
                            type="button"
                            onClick={() =>
                              void handleMarkAsRead(
                                notification.id,
                              )
                            }
                            disabled={
                              markingId ===
                              notification.id
                            }
                            className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Check size={13} />

                            {markingId ===
                            notification.id
                              ? "Marking..."
                              : "Mark as read"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
