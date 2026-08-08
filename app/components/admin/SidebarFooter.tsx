import { ShieldCheck } from "lucide-react";

export default function SidebarFooter() {
  return (
    <div className="flex items-center justify-between text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
        </div>

        <div className="leading-tight">
          <p className="font-semibold text-slate-500">
            Donara CMS
          </p>

          <p>© 2026</p>
        </div>
      </div>

      <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600 ring-1 ring-green-100">
        Secure
      </span>
    </div>
  );
}