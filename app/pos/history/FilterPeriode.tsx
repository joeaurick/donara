"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentMonth: string;
  currentYear: string;
};

const daftarBulan = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export default function FilterPeriode({
  currentMonth,
  currentYear,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startDate =
  searchParams.get("startDate") || "";

const endDate =
  searchParams.get("endDate") || "";

  const handleFilterChange = (
    key: string,
    value: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/pos/history?${params.toString()}`);
  };

  const resetFilter = () => {
    router.push(
      `/pos/history?month=${currentMonth}&year=${currentYear}`
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* BULAN */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
          Bulan
        </label>

        <select
          value={currentMonth}
          onChange={(e) =>
            handleFilterChange(
              "month",
              e.target.value
            )
          }
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        >
          {daftarBulan.map((bulan) => (
            <option
              key={bulan.value}
              value={bulan.value}
            >
              {bulan.label}
            </option>
          ))}
        </select>
      </div>

      {/* TAHUN */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
          Tahun
        </label>

        <select
          value={currentYear}
          onChange={(e) =>
            handleFilterChange(
              "year",
              e.target.value
            )
          }
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        >
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
        </select>
      </div>

      {/* DARI TANGGAL */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
          Dari Tanggal
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            handleFilterChange(
              "startDate",
              e.target.value
            )
          }
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />
      </div>

      {/* SAMPAI TANGGAL */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-500">
          Sampai Tanggal
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(e) =>
            handleFilterChange(
              "endDate",
              e.target.value
            )
          }
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />
      </div>

      {/* RESET */}
      <div className="md:col-span-2 xl:col-span-4 flex justify-end pt-1">
        <button
          type="button"
          onClick={resetFilter}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-all hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
        >
          ↺ Reset Filter
        </button>
      </div>
    </div>
  );
}