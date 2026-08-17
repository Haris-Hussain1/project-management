import {
  useState,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "./AuthContext";

interface ApiErrorResponse {
  detail?: string;
  non_field_errors?: string[];
  email?: string[];
  password?: string[];
}

interface ApiError {
  response?: {
    data?: ApiErrorResponse;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login(
        email.trim().toLowerCase(),
        password,
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const apiError = error as ApiError;
      const data = apiError.response?.data;

      if (data?.detail) {
        setError(data.detail);
      } else if (
        data?.non_field_errors?.length
      ) {
        setError(data.non_field_errors[0]);
      } else if (data?.email?.length) {
        setError(data.email[0]);
      } else if (data?.password?.length) {
        setError(data.password[0]);
      } else {
        setError(
          "Unable to sign in. Please check your credentials and try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid =
    email.trim().length > 0 &&
    password.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Left brand / product panel */}
      <aside className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex lg:w-[46%] xl:w-[48%]">
        {/* Background decoration */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/[0.035]" />
        <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-white/[0.025]" />

        <div className="relative z-10 flex w-full flex-col p-10 xl:p-14">
          {/* Brand */}
          <Link
            to="/login"
            className="flex w-fit items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950 shadow-sm">
              P
            </div>

            <span className="text-lg font-semibold tracking-tight text-white">
              Planora
            </span>
          </Link>

          {/* Main message */}
          <div className="my-auto max-w-xl py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-slate-300 backdrop-blur-sm">
              <CheckCircle2
                size={15}
                className="text-slate-200"
              />

              Built for productive teams
            </div>

            <h1 className="max-w-lg text-4xl font-semibold leading-[1.1] tracking-tight text-white xl:text-5xl">
              Turn projects into
              <span className="block text-slate-400">
                progress.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
              Plan work, collaborate with your
              team, and keep every deadline moving
              forward from one focused workspace.
            </p>

            {/* Product highlights */}
            <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                  <Sparkles
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-white">
                  Focused workspace
                </p>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Keep projects, tasks, and activity
                  organized in one place.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                  <ShieldCheck
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-white">
                  Team-ready
                </p>

                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  Stay aligned with clear ownership
                  and timely updates.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-5">
            <p className="text-[11px] text-slate-600">
              © {new Date().getFullYear()} Planora
            </p>

            <span className="text-[11px] text-slate-600">
              Project management workspace
            </span>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex min-h-screen flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-10 flex items-center justify-center lg:hidden">
            <Link
              to="/login"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
                P
              </div>

              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Planora
              </span>
            </Link>
          </div>

          {/* Form card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Heading */}
            <div className="mb-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <LockKeyhole
                  size={19}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue to your
                workspace.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                  <p className="text-xs font-medium leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-slate-700"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(
                        event.target.value,
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    disabled
                    title="Password recovery will be added later"
                    className="text-[11px] font-semibold text-slate-400 transition disabled:cursor-not-allowed"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-slate-700"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(
                        event.target.value,
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !isFormValid
                }
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <RefreshSpinner />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />

              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                New to Planora?
              </span>

              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Register */}
            <Link
              to="/register"
              className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Create an account
            </Link>
          </div>

          {/* Bottom reassurance */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck
              size={14}
              strokeWidth={1.8}
            />

            <span>
              Your workspace is protected with
              secure authentication.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function RefreshSpinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden="true"
    />
  );
}
