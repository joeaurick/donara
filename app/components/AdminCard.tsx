import { ReactNode } from "react";

type Props = {
  title: string;
  value: ReactNode;
};

export default function AdminCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">

      <h2 className="text-lg text-gray-500">
        {title}
      </h2>

      <div className="mt-3 text-5xl font-black text-pink-600">
        {value}
      </div>

    </div>
  );
}