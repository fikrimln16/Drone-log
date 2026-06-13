"use client";

import { BatteryCharging, Battery, Zap, Activity } from "lucide-react";

type Props = {
  data: any;
};

export default function FlightBatteryCard({ data }: Props) {
  const batteryUsed =
    Number(data.start_percent || 0) - Number(data.end_percent || 0);

  const voltageDrop = Number(data.start_volt || 0) - Number(data.end_volt || 0);

  const cards = [
    {
      title: "Battery A",
      value: data.battery_id || "-",
      icon: <Battery className="h-4 w-4 text-green-600" />,
      bg: "bg-green-50",
    },

    {
      title: "Battery B",
      value: data.battery_id_2 || "-",
      icon: <Battery className="h-4 w-4 text-emerald-600" />,
      bg: "bg-emerald-50",
    },

    {
      title: "Start %",
      value: `${data.start_percent}%`,
      icon: <BatteryCharging className="h-4 w-4 text-blue-600" />,
      bg: "bg-blue-50",
    },

    {
      title: "End %",
      value: `${data.end_percent}%`,
      icon: <BatteryCharging className="h-4 w-4 text-orange-600" />,
      bg: "bg-orange-50",
    },

    {
      title: "Start Volt",
      value: `${data.start_volt}V`,
      icon: <Zap className="h-4 w-4 text-purple-600" />,
      bg: "bg-purple-50",
    },

    {
      title: "End Volt",
      value: `${data.end_volt}V`,
      icon: <Zap className="h-4 w-4 text-red-600" />,
      bg: "bg-red-50",
    },

    {
      title: "Battery Used",
      value: `${batteryUsed}%`,
      icon: <Activity className="h-4 w-4 text-orange-600" />,
      bg: "bg-orange-50",
    },

    {
      title: "Voltage Drop",
      value: `${voltageDrop.toFixed(2)}V`,
      icon: <Activity className="h-4 w-4 text-red-600" />,
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-green-100 p-3">
          <BatteryCharging className="h-5 w-5 text-green-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Battery Information</h1>

          <p className="mt-1 text-sm text-slate-500">
            Battery usage and analytics
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {cards.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-slate-50 p-4 transition hover:bg-slate-100"
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-xl p-2 ${item.bg}`}>{item.icon}</div>

              <span className="text-xs font-medium text-slate-500">
                {item.title}
              </span>
            </div>

            <h1 className="mt-3 text-lg font-bold text-slate-900">
              {item.value}
            </h1>
          </div>
        ))}
      </div>

      {/* HEALTH */}
      <div className="mt-5 rounded-2xl border bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            Battery Health
          </span>

          <span
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              batteryUsed > 80
                ? "bg-red-100 text-red-700"
                : batteryUsed > 60
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
            }`}
          >
            {batteryUsed > 80
              ? "Heavy Usage"
              : batteryUsed > 60
                ? "Normal Usage"
                : "Excellent"}
          </span>
        </div>
      </div>
    </div>
  );
}
