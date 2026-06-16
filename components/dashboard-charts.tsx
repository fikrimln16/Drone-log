"use client";

import { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardCharts() {
  const [chartData, setChartData] = useState<any>({
    activity: [],
    duration: [],
    totalFlight: [],
  });

  useEffect(() => {
    fetch("/api/dashboard/charts")
      .then((res) => res.json())
      .then((res) => {
        setChartData(res);
      });
  }, []);

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
      {/* CHART 1 */}
      <ChartCard title="Flight Activity" subtitle="Weekly flight trends">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData.activity}>
            <defs>
              <linearGradient id="flightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />

                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 11,
                fill: "#64748b",
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="flights"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#flightGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* CHART 2 */}
      <ChartCard title="Mission Duration" subtitle="Duration per mission">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={chartData.duration}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 10,
              }}
            />

            <YAxis
              type="category"
              dataKey="mission"
              width={90}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#334155",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Tooltip />

            <Bar
              dataKey="duration"
              radius={[0, 8, 8, 0]}
              fill="#8b5cf6"
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* CHART 3 */}
      <ChartCard title="Total Flight" subtitle="Flight count per mission">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={chartData.totalFlight}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 10,
              }}
            />

            <YAxis
              type="category"
              dataKey="mission"
              width={90}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#334155",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[0, 8, 8, 0]}
              fill="#22c55e"
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div className="rounded-[28px] border bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-bold">{title}</h2>

        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
