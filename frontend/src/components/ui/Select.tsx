import type {
  SelectHTMLAttributes,
} from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export default function Select({
  label,
  error,
  options,
  id,
  className = "",
  ...props
}: SelectProps) {
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

      <select
        {...props}
        id={id}
        className={[
          "h-11 w-full rounded-xl border bg-white px-3.5",
          "text-sm text-slate-900 outline-none",
          "shadow-sm transition duration-200",
          "hover:border-slate-300",
          "focus:border-slate-400 focus:ring-4 focus:ring-slate-100",
          error
            ? "border-red-300"
            : "border-slate-200",
          className,
        ].join(" ")}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
