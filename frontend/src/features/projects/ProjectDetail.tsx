import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";

import { useProject } from "../../hooks/useProject";
import {
  useTaskMutations,
} from "../../hooks/useTaskMutations";
import {
  useTasks,
} from "../../hooks/useTasks";
import {
  CreateTaskModal,
} from "../tasks/Tasks";

import type {
  CreateTaskRequest,
  Task,
  TaskPriority,
  TaskStatus,
} from "../../types";

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

function statusLabel(
  status: string,
): string {
  return status
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase(),
    );
}

function priorityClass(
  priority: TaskPriority,
): string {
  switch (priority) {
    case "high":
      return "border-red-100 bg-red-50 text-red-700";

    case "medium":
      return "border-amber-100 bg-amber-50 text-amber-700";

    case "low":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";

    default:
      return "border-slate-100 bg-slate-50 text-slate-600";
  }
}

function taskStatusIcon(
  status: TaskStatus,
  size = 16,
) {
  switch (status) {
    case "completed":
      return (
        <CheckCircle2
          size={size}
          className="text-emerald-600"
          strokeWidth={2}
        />
      );

    case "in_progress":
      return (
        <Clock3
          size={size}
          className="text-blue-600"
          strokeWidth={2}
        />
      );

    default:
      return (
        <ListTodo
          size={size}
          className="text-slate-400"
          strokeWidth={2}
        />
      );
  }
}

function getInitials(
  firstName?: string,
  lastName?: string,
  username?: string,
): string {
  const first =
    firstName?.trim()?.[0] ?? "";

  const last =
    lastName?.trim()?.[0] ?? "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return (
    username
      ?.trim()
      ?.slice(0, 2)
      .toUpperCase() || "U"
  );
}

function getUserName(
  firstName?: string,
  lastName?: string,
  username?: string,
): string {
  const fullName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    username ||
    "Unknown user"
  );
}

function StatusBadge({
  status,
}: {
  status: "active" | "archived";
}) {
  const active = status === "active";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full",
        "border px-2.5 py-1",
        "text-[11px] font-semibold",
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          active
            ? "bg-emerald-500"
            : "bg-slate-400",
        ].join(" ")}
      />

      {active ? "Active" : "Archived"}
    </span>
  );
}

function LoadingState() {
  return (
    <section className="animate-pulse">
      <div className="h-4 w-28 rounded bg-slate-200" />

      <div className="mt-7 flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl bg-slate-200" />

        <div className="flex-1">
          <div className="h-8 max-w-md rounded bg-slate-200" />
          <div className="mt-3 h-4 max-w-2xl rounded bg-slate-100" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl border border-slate-200 bg-white"
            />
          ),
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_360px]">
        <div className="h-80 rounded-2xl border border-slate-200 bg-white" />

        <div className="h-80 rounded-2xl border border-slate-200 bg-white" />
      </div>
    </section>
  );
}

function ProjectTaskSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse px-5 py-5"
        >
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-lg bg-slate-100" />

            <div className="min-w-0 flex-1">
              <div className="h-4 w-2/5 rounded bg-slate-100" />

              <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />

              <div className="mt-4 h-3 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectTaskRow({
  task,
  onDelete,
  isDeleting,
}: {
  task: Task;
  onDelete: (taskId: number) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="group px-5 py-5 transition-colors hover:bg-slate-50">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 transition group-hover:bg-white">
          {taskStatusIcon(task.status)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3
                className={[
                  "truncate text-sm font-semibold",
                  task.status === "completed"
                    ? "text-slate-400 line-through"
                    : "text-slate-800",
                ].join(" ")}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                  {task.description}
                </p>
              )}
            </div>

            <span
              className={[
                "inline-flex w-fit shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                priorityClass(task.priority),
              ].join(" ")}
            >
              {statusLabel(task.priority)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              {taskStatusIcon(task.status, 14)}

              {statusLabel(task.status)}
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={14} />

              {formatDate(task.due_date)}
            </span>

            {task.assigned_to && (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Users size={13} />

                  Assigned to{" "}
                  <span className="font-medium text-slate-600">
                    {task.assigned_to.username}
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-300 opacity-0 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-100 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function ProjectDetails() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const parsedProjectId =
    Number(projectId);

  const validProjectId =
    Number.isInteger(parsedProjectId) &&
    parsedProjectId > 0
      ? parsedProjectId
      : null;

  const {
    data: project,
    isLoading,
    error,
    refresh,
  } = useProject(validProjectId);

  const [showCreateTaskModal, setShowCreateTaskModal] =
    useState(false);

  const taskFilters = useMemo(
    () => ({
      project: validProjectId ?? -1,
    }),
    [validProjectId],
  );

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
    refresh: refreshTasks,
  } = useTasks(taskFilters);

  const {
    create,
    remove,
    isCreating,
    isDeleting,
    error: taskMutationError,
  } = useTaskMutations();

  const handleCreateTask = async (
    data: CreateTaskRequest,
  ) => {
    if (!validProjectId) {
      return;
    }

    try {
      await create({
        ...data,
        project: validProjectId,
      });

      setShowCreateTaskModal(false);

      await refreshTasks();
    } catch {
      // Mutation hook already exposes the error.
    }
  };

  const handleDeleteTask = async (
    taskId: number,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?",
      );

    if (!confirmed) {
      return;
    }

    try {
      await remove(taskId);

      await refreshTasks();
    } catch {
      // Mutation hook already exposes the error.
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !project) {
    return (
      <section>
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />

          Back to projects
        </Link>

        <div className="mt-8 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
          <div className="border-b border-red-100 bg-red-50/70 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle
                  size={19}
                  className="text-red-600"
                />
              </div>

              <div>
                <h1 className="text-sm font-semibold text-red-900">
                  Unable to load project
                </h1>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error ||
                    "The requested project could not be found."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 px-6 py-5">
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw size={14} />

              Try again
            </button>

            <Link
              to="/projects"
              className="inline-flex h-9 items-center rounded-lg px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Back to projects
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const memberCount =
    project.members?.length ?? 0;

  const completedTaskCount =
    tasks.filter(
      (task) => task.status === "completed",
    ).length;

  return (
    <section className="pb-10">
      {/* Back navigation */}
      <Link
        to="/projects"
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-0.5"
        />

        Back to projects
      </Link>

      {/* Project header */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <FolderKanban
                  size={24}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {project.name}
                  </h1>

                  <StatusBadge
                    status={project.status}
                  />
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  {project.description ||
                    "No description has been added to this project."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={14} />

                    <span>
                      Created{" "}
                      {formatDate(
                        project.created_at,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3 size={14} />

                    <span>
                      Updated{" "}
                      {formatDate(
                        project.updated_at,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-slate-900 group-hover:text-white">
              <Users
                size={18}
                className="text-slate-600 group-hover:text-white"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Members
              </p>

              <p className="mt-0.5 text-xl font-semibold tracking-tight text-slate-900">
                {memberCount}
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-slate-900">
              <CalendarDays
                size={18}
                className="text-slate-600 group-hover:text-white"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Created
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {formatDate(
                  project.created_at,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-slate-900">
              <RefreshCw
                size={18}
                className="text-slate-600 group-hover:text-white"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Last updated
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {formatDate(
                  project.updated_at,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_360px]">
        {/* Tasks */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Project tasks
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Tasks belonging to this project
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isLoadingTasks &&
                tasks.length > 0 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                    {completedTaskCount}/
                    {tasks.length} completed
                  </span>
                )}

              <button
                type="button"
                onClick={() =>
                  setShowCreateTaskModal(true)
                }
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={14} />

                New task
              </button>
            </div>
          </div>

          {(tasksError || taskMutationError) && (
            <div className="border-b border-red-100 bg-red-50 px-5 py-3">
              <div className="flex items-start gap-2 text-xs text-red-700">
                <AlertCircle
                  size={15}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <span>
                  {tasksError ||
                    taskMutationError}
                </span>
              </div>
            </div>
          )}

          {isLoadingTasks ? (
            <ProjectTaskSkeleton />
          ) : tasks.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <CheckCircle2
                  size={24}
                  className="text-slate-400"
                  strokeWidth={1.7}
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-slate-800">
                No tasks yet
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-slate-400">
                Create a task for this project
                to track work, priority, status,
                assignment, and due date.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowCreateTaskModal(true)
                }
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={14} />

                Create task
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.map((task) => (
                <ProjectTaskRow
                  key={task.id}
                  task={task}
                  onDelete={(taskId) =>
                    void handleDeleteTask(taskId)
                  }
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}
        </div>

        {/* Members */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Project members
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  People working on this project
                </p>
              </div>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-[10px] font-semibold text-slate-600">
                {memberCount}
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {project.members?.length ? (
              project.members.map(
                (membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                      {getInitials(
                        membership.user
                          ?.first_name,
                        membership.user
                          ?.last_name,
                        membership.user
                          ?.username,
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {getUserName(
                          membership.user
                            ?.first_name,
                          membership.user
                            ?.last_name,
                          membership.user
                            ?.username,
                        )}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {membership.user
                          ?.email || "No email available"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold capitalize text-slate-600">
                      {membership.role}
                    </span>
                  </div>
                ),
              )
            ) : (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Users
                    size={20}
                    className="text-slate-300"
                  />
                </div>

                <p className="mt-3 text-xs font-medium text-slate-500">
                  No members found
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Add team members to start
                  collaborating.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateTaskModal && (
        <CreateTaskModal
          onClose={() =>
            setShowCreateTaskModal(false)
          }
          onCreate={handleCreateTask}
          isCreating={isCreating}
          error={taskMutationError}
          fixedProject={project}
        />
      )}

      {/* Project information */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Project information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Basic details about this project
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {/* Owner */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Owner
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[9px] font-semibold text-white">
                {getInitials(
                  project.owner?.first_name,
                  project.owner?.last_name,
                  project.owner?.username,
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-700">
                  {getUserName(
                    project.owner?.first_name,
                    project.owner?.last_name,
                    project.owner?.username,
                  )}
                </p>

                {project.owner?.email && (
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">
                    {project.owner.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Created */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Created
            </p>

            <div className="mt-3 flex items-center gap-2">
              <CalendarDays
                size={15}
                className="text-slate-400"
              />

              <p className="text-xs font-medium text-slate-700">
                {formatDate(
                  project.created_at,
                )}
              </p>
            </div>
          </div>

          {/* Last modified */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Last modified
            </p>

            <div className="mt-3 flex items-center gap-2">
              <RefreshCw
                size={15}
                className="text-slate-400"
              />

              <p className="text-xs font-medium text-slate-700">
                {formatDate(
                  project.updated_at,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
