import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/common/ProtectedRoute";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

import Dashboard from "./features/dashboard/Dashboard";
import Projects from "./features/projects/Projects";
import ProjectDetail from "./features/projects/ProjectDetail";
import Tasks from "./features/tasks/Tasks";
import Team from "./features/team/Team";
import Notifications from "./features/notifications/Notifications";
import Settings from "./features/settings/Settings";

export default function App() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC AUTH ROUTES
          ===================================================== */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* =====================================================
          PROTECTED APPLICATION ROUTES
          ===================================================== */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={<Projects />}
          />

          {/* Project Details */}
          <Route
            path="/projects/:projectId"
            element={<ProjectDetail />}
          />

          {/* My Tasks */}
          <Route
            path="/tasks"
            element={<Tasks />}
          />

          {/* Team */}
          <Route
            path="/team"
            element={<Team />}
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>
      </Route>

      {/* =====================================================
          FALLBACK
          ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

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