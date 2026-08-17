import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

import {
  useTaskMutations,
} from "../../hooks/useTaskMutations";
import {
  useTasks,
} from "../../hooks/useTasks";
import {
  useProjects,
} from "../../hooks/useProjects";

import type {
  CreateTaskRequest,
  Project,
  Task,
  TaskPriority,
  TaskStatus,
} from "../../types";

const statusOptions: {
  value: TaskStatus;
  label: string;
}[] = [
  {
    value: "todo",
    label: "To Do",
  },
  {
    value: "in_progress",
    label: "In Progress",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const priorityOptions: {
  value: TaskPriority;
  label: string;
}[] = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];

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

function priorityDot(
  priority: TaskPriority,
): string {
  switch (priority) {
    case "high":
      return "bg-red-500";

    case "medium":
      return "bg-amber-500";

    case "low":
      return "bg-emerald-500";

    default:
      return "bg-slate-400";
  }
}

function statusIcon(
  status: TaskStatus,
  size = 17,
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
        <Circle
          size={size}
          className="text-slate-400"
          strokeWidth={2}
        />
      );
  }
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "No due date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No due date";
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

function isOverdue(
  task: Task,
): boolean {
  if (
    !task.due_date ||
    task.status === "completed"
  ) {
    return false;
  }

  const dueDate = new Date(task.due_date);

  if (Number.isNaN(dueDate.getTime())) {
    return false;
  }

  return dueDate.getTime() < Date.now();
}

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (
    data: CreateTaskRequest,
  ) => Promise<void>;
  isCreating: boolean;
  error: string | null;
  projects?: Project[];
  isLoadingProjects?: boolean;
  projectsError?: string | null;
  fixedProject?: Project;
}

export function CreateTaskModal({
  onClose,
  onCreate,
  isCreating,
  error,
  projects = [],
  isLoadingProjects = false,
  projectsError = null,
  fixedProject,
}: CreateTaskModalProps) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [project, setProject] =
    useState(
      fixedProject
        ? String(fixedProject.id)
        : "",
    );

  const [priority, setPriority] =
    useState<TaskPriority>("medium");

  const [taskStatus, setTaskStatus] =
    useState<TaskStatus>("todo");

  const [dueDate, setDueDate] =
    useState("");

  const [validationError, setValidationError] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setValidationError(null);

    if (!title.trim()) {
      setValidationError(
        "Task title is required.",
      );

      return;
    }

    if (!project.trim()) {
      setValidationError(
        "Project is required.",
      );

      return;
    }

    const projectId = Number(project);

    if (
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      setValidationError(
        "Select a valid project.",
      );

      return;
    }

    const selectedProject =
      fixedProject ??
      projects.find(
        (project) =>
          project.id === projectId,
      );

    if (!selectedProject) {
      setValidationError(
        "Select a project you can access.",
      );

      return;
    }

    await onCreate({
      project: projectId,
      title: title.trim(),
      description:
        description.trim() || undefined,
      priority,
      status: taskStatus,
      due_date:
        dueDate || null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
        {/* Modal header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <ListTodo
                  size={17}
                  strokeWidth={1.9}
                />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Create task
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Add a new piece of work to your workspace.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {(validationError || error) && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-xs font-semibold text-red-800">
                  Unable to create task
                </p>

                <p className="mt-0.5 text-xs leading-5 text-red-700">
                  {validationError || error}
                </p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Task title
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="task-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="What needs to be done?"
              autoFocus
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Description
              <span className="ml-1 text-[10px] font-normal text-slate-400">
                Optional
              </span>
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Add more context, requirements, or notes..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          {/* Project / Priority */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="task-project"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Project
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              {fixedProject ? (
                <div className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-700">
                  {fixedProject.name}
                </div>
              ) : (
                <select
                  id="task-project"
                  value={project}
                  onChange={(event) =>
                    setProject(
                      event.target.value,
                    )
                  }
                  disabled={
                    isLoadingProjects ||
                    projects.length === 0
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {isLoadingProjects
                      ? "Loading projects..."
                      : "Select a project"}
                  </option>

                  {projects.map(
                    (project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.name}
                      </option>
                    ),
                  )}
                </select>
              )}

              {!fixedProject &&
                projectsError && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {projectsError}
                  </p>
                )}
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target
                      .value as TaskPriority,
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                {priorityOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="task-status"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Status
            </label>

            <select
              id="task-status"
              value={taskStatus}
              onChange={(event) =>
                setTaskStatus(
                  event.target
                    .value as TaskStatus,
                )
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              {statusOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Due date */}
          <div>
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Due date
              <span className="ml-1 text-[10px] font-normal text-slate-400">
                Optional
              </span>
            </label>

            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating && (
                <RefreshCw
                  size={15}
                  className="animate-spin"
                />
              )}

              {isCreating
                ? "Creating..."
                : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskSummaryCard({
  label,
  value,
  icon,
  iconClass,
  description,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            iconClass,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function TaskListSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse px-5 py-5"
          >
            <div className="flex gap-4">
              <div className="h-5 w-5 rounded-full bg-slate-100" />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-full max-w-sm">
                    <div className="h-4 w-3/5 rounded bg-slate-100" />

                    <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                  </div>

                  <div className="h-6 w-16 rounded-full bg-slate-100" />
                </div>

                <div className="mt-4 h-3 w-1/2 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export default function Tasks() {
  const [status, setStatus] =
    useState<TaskStatus | "all">("all");

  const [priority, setPriority] =
    useState<TaskPriority | "all">("all");

  const [search, setSearch] =
    useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const filters = useMemo(
    () => ({
      ...(status !== "all"
        ? { status }
        : {}),
      ...(priority !== "all"
        ? { priority }
        : {}),
    }),
    [status, priority],
  );

  const {
    data: tasks,
    isLoading,
    error,
    refresh,
  } = useTasks(filters);

  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError,
  } = useProjects();

  const {
    create,
    remove,
    isCreating,
    isDeleting,
    error: mutationError,
  } = useTaskMutations();

  const filteredTasks = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return tasks;
    }

    return tasks.filter((task) => {
      return (
        task.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        task.description
          ?.toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [tasks, search]);

  const completedCount =
    tasks.filter(
      (task) =>
        task.status === "completed",
    ).length;

  const inProgressCount =
    tasks.filter(
      (task) =>
        task.status === "in_progress",
    ).length;

  const overdueCount =
    tasks.filter(isOverdue).length;

  const handleCreate = async (
    data: CreateTaskRequest,
  ) => {
    try {
      await create(data);

      setShowCreateModal(false);

      await refresh();
    } catch {
      // Mutation hook already exposes the error.
    }
  };

  const handleDelete = async (
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

      await refresh();
    } catch {
      // Mutation hook already exposes the error.
    }
  };

  return (
    <section className="pb-8">
      {/* =========================================================
          PAGE HEADER
      ========================================================== */}
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Workspace
            </p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            My Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Stay on top of your workload, priorities,
            and upcoming deadlines.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={isLoading}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
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

          <button
            type="button"
            onClick={() =>
              setShowCreateModal(true)
            }
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:flex-none"
          >
            <Plus
              size={16}
              strokeWidth={2.2}
            />

            New task
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================== */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TaskSummaryCard
          label="Total tasks"
          value={tasks.length}
          icon={
            <ListTodo
              size={17}
              className="text-slate-600"
            />
          }
          iconClass="bg-slate-100"
          description="Tasks in your workspace"
        />

        <TaskSummaryCard
          label="In progress"
          value={inProgressCount}
          icon={
            <Clock3
              size={17}
              className="text-blue-600"
            />
          }
          iconClass="bg-blue-50"
          description="Currently underway"
        />

        <TaskSummaryCard
          label="Completed"
          value={completedCount}
          icon={
            <CheckCircle2
              size={17}
              className="text-emerald-600"
            />
          }
          iconClass="bg-emerald-50"
          description="Finished tasks"
        />

        <TaskSummaryCard
          label="Overdue"
          value={overdueCount}
          icon={
            <AlertCircle
              size={17}
              className="text-amber-600"
            />
          }
          iconClass="bg-amber-50"
          description="Need your attention"
        />
      </div>

      {/* =========================================================
          ERROR
      ========================================================== */}
      {(error || mutationError) && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <AlertCircle
                size={17}
                className="text-red-600"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-red-800">
                Something went wrong
              </p>

              <p className="mt-0.5 text-xs leading-5 text-red-700">
                {error || mutationError}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="ml-11 text-left text-xs font-semibold text-red-700 transition hover:text-red-900 sm:ml-0"
          >
            Try again
          </button>
        </div>
      )}

      {/* =========================================================
          FILTER / SEARCH BAR
      ========================================================== */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search tasks by title or description..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 lg:flex">
            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | TaskStatus
                    | "all",
                )
              }
              className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 lg:min-w-[150px]"
            >
              <option value="all">
                All statuses
              </option>

              {statusOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as
                    | TaskPriority
                    | "all",
                )
              }
              className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 lg:min-w-[150px]"
            >
              <option value="all">
                All priorities
              </option>

              {priorityOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <span className="text-[11px] text-slate-400">
            Showing
          </span>

          <span className="text-[11px] font-semibold text-slate-700">
            {filteredTasks.length}
          </span>

          <span className="text-[11px] text-slate-400">
            {filteredTasks.length === 1
              ? "task"
              : "tasks"}
          </span>

          {(status !== "all" ||
            priority !== "all" ||
            search) && (
            <>
              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <button
                type="button"
                onClick={() => {
                  setStatus("all");
                  setPriority("all");
                  setSearch("");
                }}
                className="text-[11px] font-semibold text-slate-500 transition hover:text-slate-900"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      </div>

      {/* =========================================================
          TASK LIST
      ========================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Tasks
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Review and manage your current workload.
            </p>
          </div>

          {!isLoading &&
            filteredTasks.length > 0 && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                {completedCount} completed
              </div>
            )}
        </div>

        {isLoading ? (
          <TaskListSkeleton />
        ) : filteredTasks.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <ListTodo
                size={24}
                strokeWidth={1.7}
                className="text-slate-400"
              />
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-700">
              No tasks found
            </p>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
              {search ||
              status !== "all" ||
              priority !== "all"
                ? "Try changing your search or filters to find what you're looking for."
                : "Create your first task to start organizing your work."}
            </p>

            {search ||
            status !== "all" ||
            priority !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                  setPriority("all");
                }}
                className="mt-5 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setShowCreateModal(true)
                }
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={14} />

                Create task
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map(
              (task) => {
                const overdue =
                  isOverdue(task);

                return (
                  <div
                    key={task.id}
                    className="group relative px-5 py-5 transition duration-150 hover:bg-slate-50/70"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Status */}
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 transition group-hover:bg-white">
                        {statusIcon(
                          task.status,
                          17,
                        )}
                      </div>

                      {/* Main task content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <h3
                                className={[
                                  "truncate text-sm font-semibold",
                                  task.status ===
                                  "completed"
                                    ? "text-slate-400 line-through"
                                    : "text-slate-800",
                                ].join(" ")}
                              >
                                {task.title}
                              </h3>
                            </div>

                            {task.description && (
                              <p className="mt-1.5 line-clamp-2 max-w-2xl text-xs leading-5 text-slate-500">
                                {
                                  task.description
                                }
                              </p>
                            )}
                          </div>

                          {/* Priority */}
                          <span
                            className={[
                              "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                              priorityClass(
                                task.priority,
                              ),
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "h-1.5 w-1.5 rounded-full",
                                priorityDot(
                                  task.priority,
                                ),
                              ].join(" ")}
                            />

                            {statusLabel(
                              task.priority,
                            )}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                            {statusIcon(
                              task.status,
                              14,
                            )}

                            <span>
                              {statusLabel(
                                task.status,
                              )}
                            </span>
                          </span>

                          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                          <span
                            className={[
                              "inline-flex items-center gap-1.5 text-xs",
                              overdue
                                ? "font-medium text-red-600"
                                : "text-slate-400",
                            ].join(" ")}
                          >
                            <CalendarDays
                              size={14}
                            />

                            {overdue
                              ? `Overdue · ${formatDate(
                                  task.due_date,
                                )}`
                              : formatDate(
                                  task.due_date,
                                )}
                          </span>

                          {task.assigned_to && (
                            <>
                              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                                <Users
                                  size={13}
                                />

                                Assigned to{" "}
                                <span className="font-medium text-slate-600">
                                  {
                                    task
                                      .assigned_to
                                      .username
                                  }
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(
                            task.id,
                          )
                        }
                        disabled={isDeleting}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-300 opacity-0 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-100 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Delete ${task.title}`}
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          OVERDUE NOTICE
      ========================================================== */}
      {!isLoading &&
        overdueCount > 0 && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <AlertCircle
                size={17}
                className="text-amber-600"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-amber-800">
                {overdueCount} overdue{" "}
                {overdueCount === 1
                  ? "task"
                  : "tasks"}
              </p>

              <p className="mt-0.5 text-xs leading-5 text-amber-700">
                Review your outstanding work and update
                the due dates or statuses where necessary.
              </p>
            </div>
          </div>
        )}

      {/* =========================================================
          CREATE MODAL
      ========================================================== */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreate={handleCreate}
          isCreating={isCreating}
          error={mutationError}
          projects={projects}
          isLoadingProjects={
            isLoadingProjects
          }
          projectsError={projectsError}
        />
      )}
    </section>
  );
}
