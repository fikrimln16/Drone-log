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

type ChartData = {
  activity: any[];
  duration: any[];
  units: any[];
};

export default function DashboardCharts() {
  const [chartData, setChartData] = useState<ChartData>({
    activity: [],
    duration: [],
    units: [],
  });

  useEffect(() => {
    fetchCharts();
  }, []);

  async function fetchCharts() {
    try {
      const res = await fetch("/api/dashboard/charts");

      const data = await res.json();

      setChartData(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
      {/* ===================================================== */}
      {/* MONTHLY FLIGHT ACTIVITY */}
      {/* ===================================================== */}

      <ChartCard title="Flight Activity" subtitle="Monthly flight trends">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData.activity}>
            <defs>
              <linearGradient id="flightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />

                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />

            <XAxis
              dataKey="month"
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

            <Tooltip formatter={(value) => [`${value} Flights`, "Activity"]} />

            <Area
              type="monotone"
              dataKey="flights"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#flightGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ===================================================== */}
      {/* TOP MISSION DURATION */}
      {/* ===================================================== */}

      <ChartCard title="Mission Duration" subtitle="Top mission flight hours">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData.duration}
            layout="vertical"
            margin={{
              left: 20,
              right: 10,
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
              width={110}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#334155",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Tooltip formatter={(value) => [`${value} hr`, "Duration"]} />

            <Bar
              dataKey="duration"
              radius={[0, 8, 8, 0]}
              fill="#8b5cf6"
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ===================================================== */}
      {/* UAV UTILIZATION */}
      {/* ===================================================== */}

      <ChartCard
        title="UAV Utilization"
        subtitle="Total flight hours per UAV unit"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData.units}
            layout="vertical"
            margin={{
              left: 20,
              right: 10,
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
              dataKey="unit"
              width={110}
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#334155",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Tooltip formatter={(value) => [`${value} hr`, "Flight Hours"]} />

            <Bar
              dataKey="hours"
              radius={[0, 8, 8, 0]}
              fill="#22c55e"
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>

        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
