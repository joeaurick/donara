import type { ReactNode } from "react";

type IconBoxVariant =
  | "pink"
  | "orange"
  | "yellow"
  | "mint"
  | "blue"
  | "purple"
  | "neutral";

type IconBoxSize =
  | "sm"
  | "md"
  | "lg";

type Props = {
  children: ReactNode;
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  rounded?: "xl" | "full";
  className?: string;
};

export default function IconBox({
  children,
  variant = "pink",
  size = "md",
  rounded = "xl",
  className = "",
}: Props) {
  const variants: Record<
    IconBoxVariant,
    string
  > = {
    pink:
      "bg-[#fff0f4] text-[#ef476f]",

    orange:
      "bg-[#fff7df] text-[#f59e0b]",

    yellow:
      "bg-yellow-50 text-yellow-600",

    mint:
      "bg-[#eaf8f6] text-[#249a91]",

    blue:
      "bg-blue-50 text-blue-600",

    purple:
      "bg-purple-50 text-purple-600",

    neutral:
      "bg-[#fffaf5] text-[#75645c]",
  };

  const sizes: Record<
    IconBoxSize,
    string
  > = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  };

  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center",
        rounded === "full"
          ? "rounded-full"
          : "rounded-2xl",
        sizes[size],
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}