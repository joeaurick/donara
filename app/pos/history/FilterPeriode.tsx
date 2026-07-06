"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterPeriode({ currentMonth, currentYear }: { currentMonth: string; currentYear: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const daftarBulan = [
    { value: "01", label: "Januari" }, { value: "02", label: "Februari" },
    { value: "03", label: "Maret" }, { value: "04", label: "April" },
    { value: "05", label: "Mei" }, { value: "06", label: "Juni" },
    { value: "07", label: "Juli" }, { value: "08", label: "Agustus" },
    { value: "09", label: "September" }, { value: "10", label: "Oktobeer" },
    { value: "11", label: "November" }, { value: "12", label: "Desember" }
  ];

  return (
    <div className="flex items-center gap-2 bg-white border p-1.5 rounded-xl shadow-xs shrink-0">
      <span className="text-xs font-black text-gray-400 uppercase pl-2">Periode:</span>
      <select 
        defaultValue={currentMonth}
        onChange={(e) => handleFilterChange("month", e.target.value)}
        className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold p-1.5 outline-none text-gray-700"
      >
        {daftarBulan.map((b) => (
          <option key={b.value} value={b.value}>{b.label}</option>
        ))}
      </select>
      
      <select 
        defaultValue={currentYear}
        onChange={(e) => handleFilterChange("year", e.target.value)}
        className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold p-1.5 outline-none text-gray-700"
      >
        <option value="2026">2026</option>
        <option value="2027">2027</option>
      </select>
    </div>
  );
}