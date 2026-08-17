import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  FolderKanban,
  Plus,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useProjects } from "../../hooks/useProjects";
import { useProjectMutations } from "../../hooks/useProjectMutations";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getInitials(
  firstName?: string,
  lastName?: string,
  username?: string,
): string {
  const first = firstName?.trim()?.[0] ?? "";
  const last = lastName?.trim()?.[0] ?? "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return (
    username?.trim()?.slice(0, 2).toUpperCase() ||
    "U"
  );
}

function ProjectStatusBadge({
  status,
}: {
  status: "active" | "archived";
}) {
  const isActive = status === "active";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
        "text-[11px] font-semibold",
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-500",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive
            ? "bg-emerald-500"
            : "bg-slate-400",
        ].join(" ")}
      />

      {isActive ? "Active" : "Archived"}
    </span>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1 animate-pulse bg-slate-100" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
        </div>

        <div className="mt-5 h-5 w-2/3 animate-pulse rounded bg-slate-100" />

        <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />

        <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-100" />

        <div className="mt-6 flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-100" />

          <div className="flex-1">
            <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const {
    data: projects,
    isLoading,
    error,
    refresh,
  } = useProjects();

  const {
    create,
    isCreating,
    error: createError,
    clearError,
  } = useProjectMutations();

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [projectName, setProjectName] =
    useState("");

  const [projectDescription, setProjectDescription] =
    useState("");

  const [projectStatus, setProjectStatus] = useState<
    "active" | "archived"
  >("active");

  const [formError, setFormError] =
    useState<string | null>(null);

  const activeProjects =
    projects?.filter(
      (project) => project.status === "active",
    ).length ?? 0;

  const archivedProjects =
    projects?.filter(
      (project) => project.status === "archived",
    ).length ?? 0;

  function openCreateModal() {
    clearError();
    setFormError(null);
    setProjectName("");
    setProjectDescription("");
    setProjectStatus("active");
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    if (isCreating) {
      return;
    }

    clearError();
    setFormError(null);
    setIsCreateModalOpen(false);
  }

  async function handleCreateProject(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = projectName.trim();

    if (!trimmedName) {
      setFormError("Project name is required.");
      return;
    }

    setFormError(null);
    clearError();

    try {
      await create({
        name: trimmedName,
        description:
          projectDescription.trim() || undefined,
        status: projectStatus,
      });

      setProjectName("");
      setProjectDescription("");
      setProjectStatus("active");
      setIsCreateModalOpen(false);

      await refresh();
    } catch {
      // The mutation hook already stores the API error.
      // Keep the modal open so the user can correct/retry.
    }
  }

  return (
    <>
      <section className="mx-auto w-full max-w-[1500px]">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}
        <div className="mb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />

                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Workspace
                </p>
              </div>

              <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-950 sm:text-[32px]">
                Projects
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Organize your work, collaborate with your
                team, and keep every project moving
                forward.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.2)] transition duration-200 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <Plus
                size={17}
                strokeWidth={2.2}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              New project
            </button>
          </div>
        </div>

        {/* =====================================================
            SUMMARY BAR
            ===================================================== */}
        {!isLoading && !error && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <div className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm">
              {projects.length}{" "}
              {projects.length === 1
                ? "project"
                : "projects"}
            </div>

            <div className="h-1 w-1 rounded-full bg-slate-300" />

            <div className="inline-flex h-8 items-center gap-2 rounded-lg bg-emerald-50 px-3 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              {activeProjects} active
            </div>

            {archivedProjects > 0 && (
              <div className="inline-flex h-8 items-center gap-2 rounded-lg bg-slate-100 px-3 text-xs font-medium text-slate-500">
                {archivedProjects} archived
              </div>
            )}
          </div>
        )}

        {/* =====================================================
            ERROR STATE
            ===================================================== */}
        {error && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-l-4 border-red-500 bg-red-50/60 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                    <AlertCircle
                      size={18}
                      className="text-red-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Unable to load projects
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void refresh()}
                  disabled={isLoading}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={14}
                    className={
                      isLoading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            LOADING STATE
            ===================================================== */}
        {isLoading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <ProjectCardSkeleton
                  key={item}
                />
              ),
            )}
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
            ===================================================== */}
        {!isLoading &&
          !error &&
          projects.length === 0 && (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50 to-transparent" />

              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
                <FolderKanban
                  size={25}
                  strokeWidth={1.7}
                />
              </div>

              <h2 className="relative mt-5 text-base font-semibold text-slate-900">
                No projects yet
              </h2>

              <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first project to start
                organizing tasks, collaborating with
                your team, and tracking progress.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="relative mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <Plus size={17} />

                Create your first project
              </button>
            </div>
          )}

        {/* =====================================================
            PROJECT GRID
            ===================================================== */}
        {!isLoading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  {/* Top accent */}
                  <div
                    className={[
                      "h-1 w-full transition-all duration-200",
                      project.status === "active"
                        ? "bg-emerald-400 group-hover:bg-emerald-500"
                        : "bg-slate-200 group-hover:bg-slate-300",
                    ].join(" ")}
                  />

                  <div className="p-5">
                    {/* Card top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-200 group-hover:border-slate-900 group-hover:bg-slate-950 group-hover:text-white">
                        <FolderKanban
                          size={19}
                          strokeWidth={1.8}
                        />
                      </div>

                      <ProjectStatusBadge
                        status={project.status}
                      />
                    </div>

                    {/* Project information */}
                    <div className="mt-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.01em] text-slate-950">
                          {project.name}
                        </h2>

                        <ArrowUpRight
                          size={16}
                          className="mt-0.5 shrink-0 text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-700"
                        />
                      </div>

                      <p className="mt-2 min-h-[40px] text-[13px] leading-5 text-slate-500">
                        {project.description ||
                          "No description has been added to this project."}
                      </p>
                    </div>

                    {/* Owner */}
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-semibold text-white ring-2 ring-white">
                        {getInitials(
                          project.owner?.first_name,
                          project.owner?.last_name,
                          project.owner?.username,
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                          Project owner
                        </p>

                        <p className="mt-0.5 truncate text-xs font-medium text-slate-700">
                          {project.owner?.first_name ||
                            project.owner?.username ||
                            "Unknown"}
                        </p>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Users
                            size={14}
                            strokeWidth={1.8}
                            className="text-slate-400"
                          />

                          {project.members?.length ?? 0}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-slate-300" />

                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <CalendarDays
                            size={14}
                            strokeWidth={1.8}
                            className="text-slate-400"
                          />

                          {formatDate(
                            project.updated_at,
                          )}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400 transition-colors duration-200 group-hover:text-slate-900">
                        Open project
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </section>

      {/* =====================================================
          CREATE PROJECT MODAL
          ===================================================== */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isCreating
            ) {
              closeCreateModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <FolderKanban
                    size={18}
                    strokeWidth={1.9}
                  />
                </div>

                <div className="min-w-0">
                  <h2
                    id="create-project-title"
                    className="text-base font-semibold tracking-[-0.01em] text-slate-950"
                  >
                    Create new project
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Set up a project to organize your work
                    and collaborate with your team.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isCreating}
                aria-label="Close create project dialog"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal form */}
            <form
              onSubmit={handleCreateProject}
            >
              <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                {(formError || createError) && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-red-900">
                        Unable to create project
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-700">
                        {formError || createError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label
                    htmlFor="project-name"
                    className="mb-2 block text-xs font-semibold text-slate-700"
                  >
                    Project name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="project-name"
                    type="text"
                    value={projectName}
                    onChange={(event) => {
                      setProjectName(
                        event.target.value,
                      );

                      if (formError) {
                        setFormError(null);
                      }

                      if (createError) {
                        clearError();
                      }
                    }}
                    placeholder="e.g. Website redesign"
                    autoFocus
                    disabled={isCreating}
                    maxLength={255}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="project-description"
                    className="mb-2 block text-xs font-semibold text-slate-700"
                  >
                    Description
                    <span className="ml-1 font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <textarea
                    id="project-description"
                    value={projectDescription}
                    onChange={(event) => {
                      setProjectDescription(
                        event.target.value,
                      );

                      if (createError) {
                        clearError();
                      }
                    }}
                    placeholder="Briefly describe what this project is about..."
                    rows={4}
                    disabled={isCreating}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="project-status"
                    className="mb-2 block text-xs font-semibold text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="project-status"
                    value={projectStatus}
                    onChange={(event) =>
                      setProjectStatus(
                        event.target.value as
                          | "active"
                          | "archived",
                      )
                    }
                    disabled={isCreating}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="archived">
                      Archived
                    </option>
                  </select>

                  <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
                    Active projects appear as current
                    workspace projects. Archived projects
                    are kept for reference.
                  </p>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isCreating}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isCreating ||
                    !projectName.trim()
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                >
                  {isCreating ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />

                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />

                      Create project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}