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
    <section className="group relative overflow-hidden rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/40">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50/40 via-transparent to-orange-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
              {title}
            </p>

            <div className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {value}
            </div>
          </div>

          {/* Decorative badge */}
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25">
            <div className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}