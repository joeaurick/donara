import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type CardVariant =
  | "default"
  | "soft"
  | "pink"
  | "orange";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: CardVariant;
};

export default function Card({
  children,
  variant = "default",
  className = "",
  ...props
}: Props) {
  const variants: Record<
    CardVariant,
    string
  > = {
    default:
      "border-[#f1e5df] bg-white",

    soft:
      "border-[#f1e5df] bg-[#fffaf5]",

    pink:
      "border-[#ffdce5] bg-[#fff0f4]",

    orange:
      "border-[#ffe6a0] bg-[#fff7df]",
  };

  return (
    <div
      className={[
        "rounded-3xl border p-5 shadow-[0_8px_30px_rgba(61,48,41,0.05)]",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}