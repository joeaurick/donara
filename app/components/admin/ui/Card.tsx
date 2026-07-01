import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Card({
  title,
  description,
  children,
}: Props) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">

      <div className="border-b border-gray-100 px-8 py-6">

        <h2 className="text-2xl font-black text-pink-600">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-gray-500">
            {description}
          </p>
        )}

      </div>

      <div className="p-8">

        {children}

      </div>

    </section>
  );
}