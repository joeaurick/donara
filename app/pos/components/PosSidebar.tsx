"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import { getUserRole } from "@/lib/auth/getUserRole";

const menus = [
  {
    title: "Dashboard",
    href: "/pos/dashboard",
    icon: "🏠",
  },
  {
    title: "History",
    href: "/pos/history",
    icon: "🧾",
  },
  {
    title: "Laporan",
    href: "/pos/report",
    icon: "📊",
  },
  {
    title: "Pengaturan",
    href: "/pos/settings",
    icon: "⚙️",
  },
];

export default function PosSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
  async function loadRole() {
    const role = await getUserRole();

    if (role) {
      setRole(role);
    }
  }

  loadRole();
}, []);

  async function logout() {
  alert("Logout diklik");

  console.log("Logout diklik");

  const { error } = await supabase.auth.signOut();

  console.log("SignOut selesai", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Berhasil logout");

  router.replace("/pos/login");
  router.refresh();
}

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">

      {/* Logo */}

      <div className="shrink-0 border-b p-6">

        <h1 className="text-2xl font-black text-pink-600">
          DONARA POS
        </h1>

      </div>

      {/* Menu */}

      <nav className="flex-1 overflow-y-auto p-4">

        <div className="space-y-2">

          {menus
  .filter((menu) => {
    if (role === "cashier") {
      return ![
        "/pos/report",
        "/pos/settings",
      ].includes(menu.href);
    }

    return true;
  })
  .map((menu) => {

            const active = pathname.startsWith(menu.href);

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                  active
                    ? "bg-pink-600 text-white"
                    : "hover:bg-pink-100"
                }`}
              >
                <span>{menu.icon}</span>
                {menu.title}
              </Link>
            );

          })}

        </div>

      </nav>

      {/* Logout */}


    </aside>
  );
}