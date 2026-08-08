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
    <section className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-pink-100/40">
      {/* Header */}
      <div className="border-b border-pink-50 bg-gradient-to-r from-pink-50/70 to-orange-50/40 px-6 py-5 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">
              {title}
            </h2>

            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-[15px]">
                {description}
              </p>
            )}
          </div>

          {/* Accent Dot */}
          <div className="mt-1 hidden h-3 w-3 rounded-full bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.45)] md:block" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-8">
        {children}
      </div>
    </section>
  );
}