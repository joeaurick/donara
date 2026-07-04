"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  data: {
    name: string;
    total: number;
  }[];
};

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
];

export default function PaymentChart({
  data,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-black">
        Metode Pembayaran
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              outerRadius={110}
              label
            >

              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}

            </Pie>

            <Tooltip
              formatter={(value: any) =>
                `Rp ${Number(value).toLocaleString("id-ID")}`
              }
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}