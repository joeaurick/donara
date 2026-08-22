import type { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "pink"
  | "orange"
  | "neutral";

type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}: Props) {
  const variants: Record<
    BadgeVariant,
    string
  > = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    danger:
      "border-red-200 bg-red-50 text-red-600",

    warning:
      "border-amber-200 bg-amber-50 text-amber-700",

    pink:
      "border-pink-200 bg-pink-50 text-pink-600",

    orange:
      "border-orange-200 bg-orange-50 text-orange-700",

    neutral:
      "border-[#f1e5df] bg-[#fffaf5] text-[#75645c]",
  };

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-full border px-3 py-1",
        "text-[10px] font-black uppercase tracking-wider",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}