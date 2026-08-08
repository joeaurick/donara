export default function SidebarHeader() {
  return (
    <div className="space-y-3">
      {/* Brand */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-pink-600">
          DONARA
        </h1>

        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
          CMS Admin
        </p>
      </div>

      {/* Admin Card */}
      <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-pink-100/70">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-200 text-pink-600">
          👤
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            Administrator
          </p>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Online
          </div>
        </div>
      </div>
    </div>
  );
}