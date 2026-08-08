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

  const handleFilterChange = (
    key: string,
    value: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set(key, value);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
        Periode
      </span>

      <select
        defaultValue={currentMonth}
        onChange={(e) =>
          handleFilterChange("month", e.target.value)
        }
        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-none transition focus:border-pink-500 focus:bg-white"
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

      <select
        defaultValue={currentYear}
        onChange={(e) =>
          handleFilterChange("year", e.target.value)
        }
        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-700 outline-none transition focus:border-pink-500 focus:bg-white"
      >
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
      </select>
    </div>
  );
}