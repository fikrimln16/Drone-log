"use client";

import { Activity, AlertTriangle, Plane, UploadCloud } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

type Props = {
  stats: any;

  onOpenActive: () => void;
};

export default function DashboardOperation({ stats, onOpenActive }: Props) {
  const activeFlights = stats.active_flight_list?.length || 0;
  const batteryAlerts = stats.battery_alerts || 0;

  const latestUpload = stats.latest_upload
    ? new Date(stats.latest_upload).toLocaleString("id-ID")
    : "-";

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {/* ACTIVE */}
      <div className="flex flex-col rounded-[28px] border bg-white p-5 shadow-sm md:min-h-[220px]">
        {/* CONTENT */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Active Flights
              </p>

              <h1 className="mt-3 text-4xl font-bold">{activeFlights}</h1>

              <p className="mt-2 text-sm text-gray-500">Flights today</p>
            </div>

            <div className="rounded-2xl bg-green-100 p-4">
              <Plane className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-auto pt-6">
          <button
            onClick={onOpenActive}
            className="flex h-[48px] w-full items-center justify-center rounded-2xl border bg-white text-sm font-semibold transition hover:bg-gray-100"
          >
            View Active Flights
          </button>
        </div>
      </div>

      {/* LOW BATTERY */}
      <div className="flex flex-col rounded-[28px] border bg-white p-5 shadow-sm md:min-h-[220px]">
        {" "}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Low Battery Alert
            </p>

            <h1 className="mt-3 text-4xl font-bold">{batteryAlerts}</h1>

            <p className="mt-2 text-sm text-gray-500">Flights below 20%</p>
          </div>

          <div className="rounded-2xl bg-red-100 p-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <div className="mt-auto grid grid-cols-1 gap-3 pt-6 md:grid-cols-2 xl:grid-cols-3">
          {stats.low_battery_flights?.map((flight: any) => (
            <div
              key={flight.flight_id}
              className="overflow-hidden rounded-2xl border bg-gray-50 p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                {/* LEFT */}
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-xs font-semibold"
                    title={flight.flight_id}
                  >
                    {flight.flight_id}
                  </p>

                  <p
                    className="mt-1 truncate text-[11px] text-gray-500"
                    title={flight.battery_id}
                  >
                    {flight.battery_id}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="self-start rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-red-700">
                  {flight.end_percent}%
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${Math.min(flight.end_percent, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LATEST */}
      <div className="flex flex-col rounded-[28px] border bg-white p-5 shadow-sm md:min-h-[220px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500">Latest Upload</p>

            <h1 className="mt-3 text-2xl leading-snug font-bold">
              {latestUpload}
            </h1>

            <p className="mt-2 text-sm text-gray-500">Last imported data</p>
          </div>

          <div className="rounded-2xl bg-blue-100 p-4">
            <UploadCloud className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="mt-auto rounded-2xl border bg-gray-50 p-4 pt-6">
          <p className="text-xs text-gray-500">Upload Status</p>

          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>

            <span className="text-sm font-semibold text-green-600">
              Synced Successfully
            </span>
          </div>
        </div>
      </div>

      {/* TOP PILOT */}
      <div className="flex flex-col rounded-[28px] border bg-white p-5 shadow-sm md:min-h-[220px]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <p className="text-sm font-semibold text-gray-500">Top Pilot</p>

              <Link
                href="/pilots"
                className="mx-2 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold transition hover:bg-gray-100"
              >
                View All
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="overflow-hidden rounded-2xl border bg-slate-100">
                <Image
                  src={
                    stats.top_pilot?.photo_url || "/images/default-avatar.png"
                  }
                  alt={stats.top_pilot?.pilot || "Pilot"}
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-cyan-600">
                  {stats.top_pilot?.pilot || "-"}
                </h1>

                <p className="text-sm text-gray-500">
                  Most active pilot this month
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-cyan-100 p-4">
            <Plane className="h-6 w-6 text-cyan-600" />
          </div>
        </div>

        {/* STATS */}
        <div className="mt-6 space-y-4">
          {/* DURATION */}
          <div className="rounded-2xl border bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Total Flight Duration</p>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold">
                {stats.top_pilot?.duration || 0} min
              </span>

              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                {stats.top_pilot?.flights || 0} Flights
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
