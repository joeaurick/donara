type Props = {
  title: string;
  subtitle: string;
};

export default function AdminHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">
          Donara CMS
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          {subtitle}
        </p>
      </div>

      {/* Decorative Accent */}
      <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20 sm:flex">
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
    </div>
  );
}