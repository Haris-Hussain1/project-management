import {
  CheckCircle2,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";

export default function Settings() {
  const {
    user,
    isLoading,
    refreshUser,
    logout,
  } = useAuth();

  const displayName =
    [
      user?.first_name,
      user?.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    user?.username ||
    "User";

  const username =
    user?.username || "Not available";

  const email =
    user?.email || "Not available";

  const handleRefresh = async () => {
    await refreshUser();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <section className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Workspace
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your account information and
          authentication settings.
        </p>
      </div>

      {/* Account */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <UserRound
                size={19}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Account
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Your profile information
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Name */}
          <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <UserRound size={17} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Full name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {displayName}
                </p>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              Account profile
            </span>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <UserRound size={17} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Username
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {username}
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <Mail size={17} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Email address
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <ShieldCheck
                size={19}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Security
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Authentication and session status
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Account authenticated
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Your current session is active.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Account actions */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Account actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Refresh your account data or end your current session.
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:px-6">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                isLoading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh account
          </button>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            <LogOut size={16} />

            Sign out
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
        <p className="text-xs leading-5 text-slate-500">
          Profile information is currently managed by your
          account system. Additional profile editing can be
          connected when the backend provides a dedicated
          profile update endpoint.
        </p>
      </div>
    </section>
  );
}