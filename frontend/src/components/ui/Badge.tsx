import type {
  ReactNode,
} from "react";

type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

const variants: Record<
  BadgeVariant,
  string
> = {
  neutral:
    "bg-slate-100 text-slate-600 ring-slate-200",

  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-100",

  warning:
    "bg-amber-50 text-amber-700 ring-amber-100",

  danger:
    "bg-red-50 text-red-700 ring-red-100",

  info:
    "bg-blue-50 text-blue-700 ring-blue-100",
};

export default function Badge({
  children,
  variant = "neutral",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full",
        "px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        variants[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
