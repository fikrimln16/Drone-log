"use client";

import {
  MapPinned,
  BatteryCharging,
  CalendarDays,
  Plane,
  Building2,
} from "lucide-react";

type Props = {
  data: any;
};

export default function FlightSummaryCard({ data }: Props) {
  const items = [
    {
      title: "AMA",
      value: data.ama_name || "-",
      icon: <MapPinned className="h-4 w-4 text-blue-600" />,
      bg: "bg-blue-50",
    },

    {
      title: "UAV",
      value: data.uav_unit || "-",
      icon: <Plane className="h-4 w-4 text-cyan-600" />,
      bg: "bg-cyan-50",
    },

    {
      title: "Battery",
      value: data.battery_color || "-",
      icon: <BatteryCharging className="h-4 w-4 text-green-600" />,
      bg: "bg-green-50",
    },

    {
      title: "Estate",
      value: data.estate || "-",
      icon: <Building2 className="h-4 w-4 text-orange-600" />,
      bg: "bg-orange-50",
    },

    {
      title: "Created",
      value: new Date(data.created_at).toLocaleDateString("id-ID"),
      icon: <CalendarDays className="h-4 w-4 text-purple-600" />,
      bg: "bg-purple-50",
    },

    {
      title: "Updated",
      value: new Date(data.updated_at).toLocaleDateString("id-ID"),
      icon: <CalendarDays className="h-4 w-4 text-pink-600" />,
      bg: "bg-pink-50",
    },
  ];

  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Flight Summary</h1>

      <p className="mt-1 text-sm text-slate-500">General flight information</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {items.map((item) => (
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
    </div>
  );
}
