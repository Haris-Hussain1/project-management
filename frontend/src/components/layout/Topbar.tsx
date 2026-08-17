import {
  Bell,
  Menu,
  Search,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

interface TopbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/projects": "Projects",
  "/tasks": "My Tasks",
  "/team": "Team",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

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

export default function Topbar({
  onMenuClick,
}: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const title =
    pageTitles[location.pathname] ??
    "Workspace";

  const displayName = getDisplayName(
    user?.first_name,
    user?.last_name,
    user?.username,
  );

  const initials = getInitials(
    user?.first_name,
    user?.last_name,
    user?.username,
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/80 bg-white/90 px-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-xl lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
        </div>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/notifications")
          }
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        <div className="ml-1 h-7 w-px bg-slate-200" />

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-[11px] font-semibold text-white">
              {initials}
            </div>
          )}

          <div className="hidden text-left md:block">
            <p className="text-xs font-medium text-slate-800">
              {displayName}
            </p>

            <p className="max-w-32 truncate text-[10px] text-slate-500">
              {user?.email ?? "Member"}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
