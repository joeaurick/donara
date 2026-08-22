export default function SidebarHeader() {
  return (
    <div className="space-y-5">
      {/* ================= BRAND ================= */}
      <div className="flex items-center gap-3">
        {/* Brand Icon */}
        

        {/* Brand Text */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-[-0.04em] text-slate-900">
              DONARA
            </h1>

            <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-pink-600">
              CMS
            </span>
          </div>

          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-pink-500">
            Donut Management
          </p>
        </div>
      </div>

      {/* ================= ADMIN PROFILE ================= */}
      <div className="group relative overflow-hidden rounded-[22px] border border-pink-100 bg-gradient-to-br from-white via-pink-50/40 to-orange-50/40 p-3.5 shadow-sm transition-all duration-200 hover:border-pink-200 hover:shadow-md">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-pink-100/60 blur-2xl" />

        <div className="relative flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-lg shadow-md shadow-pink-500/20">
            👤

            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-900">
              Administrator
            </p>

            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-emerald-600">
                ●
              </span>

              <span className="text-[10px] font-semibold text-slate-400">
                Online & siap mengelola
              </span>
            </div>
          </div>

          {/* Status badge */}
          <div className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-600">
            Aktif
          </div>
        </div>
      </div>
    </div>
  );
}