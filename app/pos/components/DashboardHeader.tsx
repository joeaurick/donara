"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Props = {
  todayStock: any;
  todayClosed: boolean;
  closing: boolean;
  handleCloseDay: () => void;
};

export default function DashboardHeader({
  todayStock,
  todayClosed,
  closing,
  handleCloseDay,
}: Props) {
  const router = useRouter();

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/pos/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-white">

      <div className="flex items-start justify-between px-5 py-4">

        <div>

          <h1 className="text-2xl font-black text-pink-600">
            DONARA POS
          </h1>

          <p className="text-xs text-gray-500">
            Point of Sale
          </p>

          {todayStock && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">

              <span className="font-bold">
                {todayClosed ? "🔴 Tutup" : "🟢 Buka"}
              </span>

              <span>|</span>

              <span>
                Donat :
                <b className="ml-1">
                  {todayStock.opening_stock}
                </b>
              </span>

              <span>|</span>

              <span>
                Sisa :
                <b className="ml-1 text-green-600">
                  {todayStock.remaining_stock}
                </b>
              </span>

              <span>|</span>

              <span>
                Terjual :
                <b className="ml-1 text-yellow-600">
                  {todayStock.opening_stock -
                    todayStock.remaining_stock}
                </b>
              </span>

              {!todayClosed && (
                <button
                  onClick={handleCloseDay}
                  disabled={closing}
                  className="ml-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:bg-gray-400"
                >
                  {closing ? "Menutup..." : "Tutup Hari"}
                </button>
              )}

            </div>
          )}

        </div>

        <button
          onClick={logout}
          className="rounded-xl bg-red-500 px-5 py-2 font-bold text-white hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </header>
  );
}