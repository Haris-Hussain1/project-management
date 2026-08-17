import type {
  InputHTMLAttributes,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={id}
        className={[
          "h-11 w-full rounded-xl border bg-white px-3.5",
          "text-sm text-slate-900 outline-none",
          "placeholder:text-slate-400",
          "shadow-sm transition duration-200",
          "hover:border-slate-300",
          "focus:border-slate-400 focus:ring-4 focus:ring-slate-100",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-50"
            : "border-slate-200",
          className,
        ].join(" ")}
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}
