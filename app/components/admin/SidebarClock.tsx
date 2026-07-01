"use client";

import { useEffect, useState } from "react";

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
    <div className="border-t border-b border-pink-100 px-6 py-4">

      <div className="text-xl font-black text-pink-600">
        🕒 {time}
      </div>

      <div className="mt-1 text-sm text-gray-500">
        {date}
      </div>

    </div>
  );
}