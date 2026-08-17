import {
  AlertCircle,
} from "lucide-react";
import type {
  ReactNode,
} from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 px-6 py-12 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <AlertCircle size={20} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {message}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}
