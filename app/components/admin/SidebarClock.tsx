"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export default function SidebarClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-pink-100 bg-white px-3 py-3 shadow-sm">
      <div className="flex items-center gap-2 text-pink-600">
        <Clock3 className="h-4 w-4" />

        <span className="text-xl font-black tracking-tight">
          {time}
        </span>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {date}
      </p>
    </div>
  );
}