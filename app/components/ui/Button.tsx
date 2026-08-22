"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "orange"
  | "outline"
  | "danger"
  | "ghost";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  ...props
}: Props) {
  const variantClasses: Record<
    ButtonVariant,
    string
  > = {
    primary:
      "bg-[#ef476f] text-white shadow-[0_8px_20px_rgba(239,71,111,0.22)] hover:bg-[#dc355c] hover:shadow-[0_10px_25px_rgba(239,71,111,0.28)]",

    secondary:
      "bg-[#fff0f4] text-[#ef476f] hover:bg-[#ffe3eb]",

    orange:
      "bg-[#ffb703] text-[#3d3029] shadow-[0_8px_20px_rgba(255,183,3,0.20)] hover:bg-[#f4a900]",

    outline:
      "border border-[#f1e5df] bg-white text-[#3d3029] hover:border-[#ef476f]/30 hover:bg-[#fffaf5]",

    danger:
      "bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.18)] hover:bg-red-700",

    ghost:
      "bg-transparent text-[#75645c] hover:bg-[#fff0f4] hover:text-[#ef476f]",
  };

  const sizeClasses: Record<
    ButtonSize,
    string
  > = {
    sm: "min-h-9 rounded-xl px-3 py-2 text-xs",
    md: "min-h-11 rounded-2xl px-4 py-3 text-sm",
    lg: "min-h-13 rounded-2xl px-6 py-4 text-base",
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2",
        "font-black transition-all duration-200",
        "active:scale-[0.97]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      <span>{children}</span>
    </button>
  );
}