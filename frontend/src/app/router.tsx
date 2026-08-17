import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Workspace
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
        <p className="text-sm text-slate-400">
          This section is coming next.
        </p>
      </div>
    </section>
  );
}

function DashboardPage() {
  return (
    <PlaceholderPage
      title="Overview"
      description="A quick view of your projects, tasks, and activity."
    />
  );
}

function TasksPage() {
  return (
    <PlaceholderPage
      title="My Tasks"
      description="Track and manage the work assigned to you."
    />
  );
}

function ProjectsPage() {
  return (
    <PlaceholderPage
      title="Projects"
      description="Organize your work across projects and teams."
    />
  );
}

function NotificationsPage() {
  return (
    <PlaceholderPage
      title="Notifications"
      description="Stay up to date with activity in your workspace."
    />
  );
}

function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Manage your account and workspace preferences."
    />
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);