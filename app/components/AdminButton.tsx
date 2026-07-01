import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export default function AdminButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: Props) {
  const styles = {
    primary:
      "bg-pink-600 hover:bg-pink-700 text-white",

    secondary:
      "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-6 py-3 font-bold transition ${styles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}