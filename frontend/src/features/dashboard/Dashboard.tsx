import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useDashboard } from "./useDashboard";

function StatCard({
  label,
  value,
  icon: Icon,
  description,
}: {
  label: string;
  value: number;
  icon: typeof FolderKanban;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1.5 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-slate-900 group-hover:text-white">
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function statusLabel(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function priorityClass(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-50 text-red-700";

    case "medium":
      return "bg-amber-50 text-amber-700";

    case "low":
      return "bg-emerald-50 text-emerald-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function SectionHeader({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <Link
        to={href}
        className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
      >
        View all
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="animate-pulse px-5 py-4">
      <div className="h-4 w-2/3 rounded-md bg-slate-100" />

      <div className="mt-2 h-3 w-1/2 rounded-md bg-slate-100" />
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="animate-pulse px-5 py-4">
      <div className="flex gap-3">
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-100" />

        <div className="min-w-0 flex-1">
          <div className="h-4 w-3/4 rounded-md bg-slate-100" />

          <div className="mt-2 h-3 w-full rounded-md bg-slate-100" />

          <div className="mt-2 h-3 w-1/4 rounded-md bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    error,
    refresh,
  } = useDashboard();

  const displayName =
    user?.first_name ||
    user?.username ||
    "there";

  return (
    <section className="pb-8">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace overview
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Good to see you, {displayName}.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Here's what's happening across your
            projects and tasks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            size={15}
            className={
              isLoading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}
      {error && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertCircle
                size={17}
                className="text-red-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {/* =====================================================
          STATS
          ===================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects"
          value={
            isLoading
              ? 0
              : data.stats.total_projects
          }
          icon={FolderKanban}
          description="Projects you're working on"
        />

        <StatCard
          label="My tasks"
          value={
            isLoading
              ? 0
              : data.stats.total_tasks
          }
          icon={ListTodo}
          description="Tasks available to you"
        />

        <StatCard
          label="In progress"
          value={
            isLoading
              ? 0
              : data.stats.in_progress_tasks
          }
          icon={RefreshCw}
          description="Tasks currently underway"
        />

        <StatCard
          label="Completed"
          value={
            isLoading
              ? 0
              : data.stats.completed_tasks
          }
          icon={CheckCircle2}
          description="Finished tasks"
        />
      </div>

      {/* =====================================================
          PRIMARY WORKSPACE
          ===================================================== */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        {/* =================================================
            TASKS
            ================================================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <SectionHeader
            title="My tasks"
            description="Your current workload"
            href="/tasks"
          />

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((item) => (
                  <TaskSkeleton key={item} />
                ))}
              </>
            ) : data.tasks.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
                  <ListTodo
                    size={21}
                    className="text-slate-400"
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No tasks yet
                </p>

                <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                  Tasks assigned to you will appear
                  here.
                </p>
              </div>
            ) : (
              data.tasks
                .slice(0, 6)
                .map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50/70"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-slate-950">
                        {task.title}
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        {task.project_name && (
                          <span className="max-w-[180px] truncate text-xs font-medium text-slate-400">
                            {task.project_name}
                          </span>
                        )}

                        {task.project_name && (
                          <span className="text-slate-300">
                            •
                          </span>
                        )}

                        <span className="text-xs text-slate-400">
                          {statusLabel(
                            task.status,
                          )}
                        </span>

                        {task.due_date && (
                          <>
                            <span className="text-slate-300">
                              •
                            </span>

                            <span className="text-xs text-slate-400">
                              Due{" "}
                              {formatDate(
                                task.due_date,
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <span
                      className={[
                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        priorityClass(
                          task.priority,
                        ),
                      ].join(" ")}
                    >
                      {statusLabel(
                        task.priority,
                      )}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* =================================================
            ACTIVITY
            ================================================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <SectionHeader
            title="Recent activity"
            description="Latest workspace notifications"
            href="/notifications"
          />

          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((item) => (
                  <ActivitySkeleton
                    key={item}
                  />
                ))}
              </>
            ) : data.notifications.length ===
              0 ? (
              <div className="px-5 py-14 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
                  <Bell
                    size={21}
                    className="text-slate-400"
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  No recent activity
                </p>

                <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
                  New workspace activity will
                  appear here.
                </p>
              </div>
            ) : (
              data.notifications
                .slice(0, 6)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="px-5 py-4 transition hover:bg-slate-50/70"
                  >
                    <div className="flex gap-3">
                      <div
                        className={[
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          notification.is_read
                            ? "bg-slate-200"
                            : "bg-slate-900",
                        ].join(" ")}
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {notification.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>

                        <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                          {formatDate(
                            notification.created_at,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          RECENT PROJECTS
          ===================================================== */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <SectionHeader
          title="Recent projects"
          description="Projects you've recently worked on"
          href="/projects"
        />

        {isLoading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-xl bg-slate-50"
              />
            ))}
          </div>
        ) : data.projects.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
              <FolderKanban
                size={21}
                className="text-slate-400"
                strokeWidth={1.8}
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              No projects yet
            </p>

            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-400">
              Create a project to start organizing
              your work.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.projects
              .slice(0, 5)
              .map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50/70"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-slate-900 group-hover:text-white">
                      <FolderKanban
                        size={16}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-slate-950">
                        {project.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {project.description ||
                          "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-xs font-medium text-slate-400 sm:block">
                      {formatDate(
                        project.updated_at,
                      )}
                    </span>

                    <ArrowRight
                      size={14}
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600"
                    />
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>

      {/* =====================================================
          OVERDUE WARNING
          ===================================================== */}
      {!isLoading &&
        data.stats.overdue_tasks > 0 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <AlertCircle
                size={18}
                className="text-amber-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-800">
                {data.stats.overdue_tasks} overdue{" "}
                {data.stats.overdue_tasks === 1
                  ? "task"
                  : "tasks"}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-amber-700">
                Review your outstanding work and
                update due dates or statuses where
                necessary.
              </p>
            </div>
          </div>
        )}
    </section>
  );
}
