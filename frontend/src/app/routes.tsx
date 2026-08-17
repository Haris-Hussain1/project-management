import { Navigate, Route, Routes } from "react-router-dom";

import AppShell from "../components/layout/AppShell";
import ProtectedRoute from "../components/common/ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your workspace.</p>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div>
      <h1>Projects</h1>
      <p>Your projects will appear here.</p>
    </div>
  );
}

function TasksPage() {
  return (
    <div>
      <h1>Tasks</h1>
      <p>Your tasks will appear here.</p>
    </div>
  );
}

function NotificationsPage() {
  return (
    <div>
      <h1>Notifications</h1>
      <p>Your notifications will appear here.</p>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Protected application routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/projects"
            element={<ProjectsPage />}
          />

          <Route
            path="/tasks"
            element={<TasksPage />}
          />

          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />
        </Route>
      </Route>

      {/* Default route */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}