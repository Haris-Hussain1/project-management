import {
  Search,
  Users,
  Mail,
  FolderKanban,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getTeamMembers,
  type TeamMember,
} from "./teamApi";

function getDisplayName(
  user: TeamMember["user"],
): string {
  const fullName = [
    user.first_name,
    user.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    user.username ||
    user.email
  );
}

function getInitials(
  user: TeamMember["user"],
): string {
  const fullName = [
    user.first_name,
    user.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map(
        (part) => part.charAt(0),
      )
      .join("")
      .toUpperCase();
  }

  return (
    user.username
      ?.slice(0, 2)
      .toUpperCase() ||
    "U"
  );
}

function roleLabel(
  role: string,
): string {
  return role
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function roleClass(
  role: string,
): string {
  switch (role) {
    case "owner":
      return "bg-violet-50 text-violet-700";

    case "admin":
      return "bg-blue-50 text-blue-700";

    case "member":
      return "bg-emerald-50 text-emerald-700";

    case "viewer":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function MemberSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" />

        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 rounded bg-slate-100" />

          <div className="mt-2 h-3 w-44 rounded bg-slate-100" />

          <div className="mt-4 h-3 w-24 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function MemberCard({
  member,
}: {
  member: TeamMember;
}) {
  const displayName =
    getDisplayName(member.user);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
          {getInitials(member.user)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </h3>

              <p className="mt-1 truncate text-xs text-slate-500">
                @{member.user.username}
              </p>
            </div>
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <Mail
              size={13}
              className="shrink-0 text-slate-400"
            />

            <span className="truncate">
              {member.user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {member.roles.map((role) => (
            <span
              key={role}
              className={[
                "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                roleClass(role),
              ].join(" ")}
            >
              {roleLabel(role)}
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
          <FolderKanban size={13} />

          <span>
            {member.projectCount}{" "}
            {member.projectCount === 1
              ? "project"
              : "projects"}
          </span>
        </div>
      </div>

      {member.projects.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.projects
            .slice(0, 3)
            .map((project) => (
              <span
                key={project}
                className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-500"
              >
                {project}
              </span>
            ))}

          {member.projects.length > 3 && (
            <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] text-slate-400">
              +{member.projects.length - 3}{" "}
              more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function Team() {
  const [members, setMembers] =
    useState<TeamMember[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const loadMembers = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data =
          await getTeamMembers();

        setMembers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            "Unable to load team members. Please try again.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return members;
    }

    return members.filter(
      (member) => {
        const name =
          getDisplayName(
            member.user,
          ).toLowerCase();

        const username =
          member.user.username.toLowerCase();

        const email =
          member.user.email.toLowerCase();

        const projects =
          member.projects
            .join(" ")
            .toLowerCase();

        return (
          name.includes(query) ||
          username.includes(query) ||
          email.includes(query) ||
          projects.includes(query)
        );
      },
    );
  }, [members, search]);

  return (
    <section>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Team
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            See everyone working across
            your projects and understand
            their current workspace roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadMembers()}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
        >
          <RefreshCw
            size={16}
            className={
              isLoading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Team members
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {isLoading
                  ? "—"
                  : members.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                People across your projects
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Users
                size={19}
                strokeWidth={1.8}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Visible projects
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {isLoading
                  ? "—"
                  : new Set(
                      members.flatMap(
                        (member) =>
                          member.projects,
                      ),
                    ).size}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Projects represented in your team
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FolderKanban
                size={19}
                strokeWidth={1.8}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search team members, email, or project..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle
              size={18}
              className="shrink-0 text-red-600"
            />

            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadMembers()}
            className="self-start text-sm font-semibold text-red-700 hover:text-red-800 sm:self-auto"
          >
            Try again
          </button>
        </div>
      )}

      {/* Members */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <MemberSkeleton
                key={item}
              />
            ),
          )}
        </div>
      ) : filteredMembers.length ===
        0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Users size={22} />
          </div>

          <h2 className="mt-4 text-sm font-semibold text-slate-800">
            {search
              ? "No team members found"
              : "No team members yet"}
          </h2>

          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
            {search
              ? "Try a different name, email, or project search."
              : "Members added to your projects will appear here."}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {filteredMembers.length}
              </span>{" "}
              {filteredMembers.length ===
              1
                ? "member"
                : "members"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredMembers.map(
              (member) => (
                <MemberCard
                  key={member.user.id}
                  member={member}
                />
              ),
            )}
          </div>
        </>
      )}
    </section>
  );
}