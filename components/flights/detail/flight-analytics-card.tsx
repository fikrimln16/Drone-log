"use client";

import { Activity } from "lucide-react";

type Props = {
  data: any;
};

export default function FlightAnalyticsCard({ data }: Props) {
  const batteryUsed = Number(data.start_percent) - Number(data.end_percent);

  const voltDrop = Number(data.start_volt) - Number(data.end_volt);

  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-purple-100 p-3">
          <Activity className="h-5 w-5 text-purple-600" />
        </div>

        <div>
          <h1 className="text-xl font-bold">Flight Analytics</h1>

          <p className="text-sm text-slate-500">Battery performance</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Battery Used</p>

          <h1 className="mt-2 text-2xl font-black text-orange-600">
            {batteryUsed}%
          </h1>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Voltage Drop</p>

          <h1 className="mt-2 text-2xl font-black text-red-600">
            {voltDrop.toFixed(2)}V
          </h1>
        </div>
      </div>
    </div>
  );
}
