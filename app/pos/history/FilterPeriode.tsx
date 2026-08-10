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

    // Jika memilih tanggal manual,
    // hapus filter bulan & tahun
    if (
      key === "startDate" ||
      key === "endDate"
    ) {
      params.delete("month");
      params.delete("year");
    }
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
  <div className="space-y-3">
    {/* Bulan & Tahun */}
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
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
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
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

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
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
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        >
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
        </select>
      </div>
    </div>

    {/* Rentang Tanggal */}
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          Dari
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
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          Sampai
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
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />
      </div>
    </div>

    {/* Reset */}
    <div className="pt-1">
      <button
        type="button"
        onClick={resetFilter}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
      >
        ↺ Reset Filter
      </button>
    </div>
  </div>
);
}