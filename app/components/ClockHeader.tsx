"use client";

import { useEffect, useState } from "react";

export default function ClockHeader() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col leading-tight">
      <span className="text-lg font-black text-slate-900 md:text-xl font-mono tracking-wide">
        {now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>

      <span className="text-xs text-slate-500">
        {now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  );
}