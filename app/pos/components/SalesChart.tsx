"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  data: {
    hour: string;
    total: number;
  }[];
};

export default function SalesChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-black">
        Grafik Penjualan Hari Ini
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="label" />

            <YAxis />

            <Tooltip
              formatter={(value: any) =>
                `Rp ${Number(value).toLocaleString("id-ID")}`
              }
            />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#ec4899"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}