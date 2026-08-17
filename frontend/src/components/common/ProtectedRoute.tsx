import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

export default function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div
        className="auth-loading"
        role="status"
        aria-live="polite"
        aria-label="Loading your workspace"
      >
        <div className="loading-spinner" />
        <span>Loading your workspace...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}