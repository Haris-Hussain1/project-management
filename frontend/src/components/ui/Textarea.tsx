import type {
  TextareaHTMLAttributes,
} from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Textarea({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: TextareaProps) {
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

      <textarea
        {...props}
        id={id}
        className={[
          "min-h-28 w-full resize-y rounded-xl border bg-white",
          "px-3.5 py-3 text-sm text-slate-900 outline-none",
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
