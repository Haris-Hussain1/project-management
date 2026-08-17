import {
  Bell,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    to: "/projects",
  },
  {
    label: "My Tasks",
    icon: CheckSquare,
    to: "/tasks",
  },
  {
    label: "Team",
    icon: Users,
    to: "/team",
  },
  {
    label: "Notifications",
    icon: Bell,
    to: "/notifications",
  },
];

function getInitials(
  firstName?: string,
  lastName?: string,
  username?: string,
) {
  const first = firstName?.trim().charAt(0) ?? "";
  const last = lastName?.trim().charAt(0) ?? "";

  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }

  return (
    username?.trim().slice(0, 2).toUpperCase() || "U"
  );
}

function getDisplayName(
  firstName?: string,
  lastName?: string,
  username?: string,
) {
  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || username || "User";
}

export default function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const { user } = useAuth();

  const initials = getInitials(
    user?.first_name,
    user?.last_name,
    user?.username,
  );

  const displayName = getDisplayName(
    user?.first_name,
    user?.last_name,
    user?.username,
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "border-r border-slate-200/80 bg-white",
          "shadow-[8px_0_30px_rgba(15,23,42,0.04)]",
          "transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">
              P
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Planora
              </p>

              <p className="text-[11px] text-slate-500">
                Workspace
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace */}
        <div className="px-4 pt-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                W
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  My Workspace
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-medium transition duration-200",
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={
                          isActive ? 2.2 : 1.8
                        }
                      />

                      <span>{item.label}</span>

                      {item.label ===
                        "Notifications" && (
                        <span
                          className={[
                            "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          0
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="my-5 border-t border-slate-200" />

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Manage
          </p>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-2.5",
                "text-sm font-medium transition duration-200",
                isActive
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            <Settings
              size={18}
              strokeWidth={1.8}
            />

            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Current user */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-2.5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {displayName}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user?.email ?? "Member"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
