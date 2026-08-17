import { useState } from "react";
import {
  Bell,
  CheckSquare,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

const secondaryNavigation = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "border-r border-slate-200 bg-white",
          "transition-transform duration-200 ease-out",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
              PM
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                ProjectFlow
              </p>
              <p className="text-[11px] text-slate-400">
                Workspace
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace selector */}
        <div className="px-3 pt-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:border-slate-300 hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              W
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                My Workspace
              </p>
              <p className="truncate text-[11px] text-slate-400">
                Personal workspace
              </p>
            </div>

            <ChevronDown
              size={15}
              className="shrink-0 text-slate-400"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-medium transition-all",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />

                      <span>{item.label}</span>

                      {item.label === "Notifications" && (
                        <span
                          className={[
                            "ml-auto flex h-5 min-w-5 items-center justify-center",
                            "rounded-full px-1.5 text-[10px] font-semibold",
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          3
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="my-6 border-t border-slate-100" />

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Account
          </p>

          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-medium transition-all",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
              HH
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                Haris Hussain
              </p>
              <p className="truncate text-[11px] text-slate-400">
                Account
              </p>
            </div>

            <ChevronDown
              size={15}
              className="text-slate-400"
            />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="relative hidden w-full max-w-md md:block">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search tasks, projects..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
              />

              <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
                /
              </kbd>
            </div>

            <div className="ml-auto flex items-center gap-1">
              {/* Mobile search */}
              <button
                type="button"
                className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              {/* Notifications */}
              <button
                type="button"
                className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Notifications"
              >
                <Bell size={19} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              <div className="mx-2 hidden h-6 w-px bg-slate-200 sm:block" />

              {/* User */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white">
                  HH
                </div>

                <ChevronDown
                  size={14}
                  className="hidden text-slate-400 sm:block"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;