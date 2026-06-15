"use client";

import { Clock3, Plane, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import FlightDetailModal from "../flights/flight-detail-modal";
import Image from "next/image";

type Props = {
  open: boolean;

  data: any;

  loading: boolean;

  onClose: () => void;
};

export default function PilotAnalyticsModal({
  open,
  data,
  loading,
  onClose,
}: Props) {
  if (!open) return null;

  const summary = data?.summary;
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  function getStatus(duration: number) {
    if (duration >= 21) {
      return {
        label: "High Load",

        className: "bg-red-100 text-red-700",
      };
    }

    if (duration >= 300) {
      return {
        label: "Medium",

        className: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      label: "Safe",

      className: "bg-green-100 text-green-700",
    };
  }

  const status = getStatus(Number(summary?.total_duration || 0) / 60);

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="relative flex h-[95vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {" "}
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
        {/* HEADER */}
        <div className="border-b bg-gradient-to-r from-slate-50 to-white px-8 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* PHOTO */}
            {/* <div className="shrink-0">
              <div className="overflow-hidden rounded-[32px] border-4 border-cyan-100 shadow-lg">
                <Image
                  src={summary?.photo_url || "/images/default-avatar.png"}
                  alt={summary?.pilot}
                  width={160}
                  height={160}
                  className="h-40 w-40 object-cover"
                />
              </div>
            </div> */}

            <div className="relative mx-auto sm:mx-0">
              <div className="overflow-hidden rounded-[28px] border-4 border-cyan-100 shadow-xl">
                {summary?.photo_url ? (
                  <Image
                    src={summary.photo_url}
                    alt={summary?.pilot || "Pilot"}
                    width={160}
                    height={160}
                    className="h-[120px] w-[120px] object-cover md:h-[160px] md:w-[160px]"
                  />
                ) : (
                  <div className="flex h-[120px] w-[120px] items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100 md:h-[160px] md:w-[160px]">
                    <span className="text-4xl font-black text-cyan-700 md:text-6xl">
                      {summary?.pilot?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute -right-2 -bottom-2 rounded-2xl bg-cyan-500 p-2 shadow-lg">
                <Plane className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2">
                <Plane className="h-4 w-4 text-cyan-600" />

                <span className="text-xs font-bold tracking-[0.2em] text-cyan-700 uppercase">
                  Pilot Command Center
                </span>
              </div>
              <h1 className="mt-2 text-5xl font-black">{summary?.pilot}</h1>

              <div className="mt-4 flex flex-wrap gap-3">
                <div
                  className={`rounded-full px-4 py-2 text-sm font-bold ${status.className}`}
                >
                  {status.label}
                </div>

                {summary?.last_flight && (
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    Last Flight •{" "}
                    {new Date(summary.last_flight).toLocaleDateString("id-ID")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          {loading ? (
            <div className="py-20 text-center text-lg font-semibold">
              Loading...
            </div>
          ) : (
            <div className="space-y-8">
              {/* STATS */}
              <div className="grid grid-cols-1 grid-cols-2 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Card
                  title="Total Flights"
                  value={summary?.total_flights || 0}
                  icon={<Plane className="h-6 w-6 text-purple-600" />}
                  bg="bg-purple-100"
                />

                <Card
                  title="Total Duration"
                  value={`${summary?.total_duration || 0} min`}
                  icon={<Clock3 className="h-6 w-6 text-yellow-600" />}
                  bg="bg-yellow-100"
                />

                <Card
                  title="Total Missions"
                  value={summary?.total_missions || 0}
                  icon={<ShieldCheck className="h-6 w-6 text-blue-600" />}
                  bg="bg-blue-100"
                />

                <Card
                  title="Average Duration"
                  value={`${summary?.avg_duration || 0} min`}
                  icon={<Clock3 className="h-6 w-6 text-green-600" />}
                  bg="bg-green-100"
                />
              </div>

              {/* MISSION ACTIVITY */}
              <div className="rounded-[28px] border bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Mission Activity</h2>

                  <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                    {data?.missions?.length || 0} Missions
                  </span>
                </div>

                <div className="max-h-[320px] space-y-4 overflow-y-auto pr-2">
                  {data?.missions?.map((item: any) => (
                    <div
                      key={item.mission_name}
                      className="flex flex-col gap-4 rounded-2xl border bg-gray-50 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-bold">{item.mission_name}</p>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.total} flights
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-semibold text-yellow-700">
                          {item.duration} min
                        </div>

                        <Link
                          href={`/missions/${encodeURIComponent(
                            item.mission_name
                          )}`}
                          className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
                        >
                          View Mission
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RECENT FLIGHTS */}
              <div className="rounded-[28px] border bg-white p-6">
                <h2 className="text-2xl font-bold">Recent Flights</h2>

                <div className="-mx-5 overflow-x-auto md:mx-0">
                  <table className="min-w-[900px]">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                          Flight
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                          AMA
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                          UAV
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                          Duration
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                          Battery
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
                          Date
                        </th>

                        <th className="px-5 py-4 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.recent_flights?.map((flight: any) => (
                        <tr
                          key={flight.flight_id}
                          className="border-b transition-all hover:bg-slate-50"
                        >
                          {/* FLIGHT */}
                          <td className="px-5 py-4">
                            <div>
                              <h1 className="font-semibold text-slate-900">
                                {flight.mission_name}
                              </h1>

                              <span className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                {flight.flight_id}
                              </span>
                            </div>
                          </td>

                          {/* AMA */}
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                              {flight.ama || "No AMA"}
                            </span>
                          </td>

                          {/* UAV */}
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                              {flight.uav_unit}
                            </span>
                          </td>

                          {/* DURATION */}
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                              {flight.duration_min} min
                            </span>
                          </td>

                          {/* BATTERY */}
                          <td className="px-5 py-4">
                            <div className="w-[120px]">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                  Remaining
                                </span>

                                <span className="text-xs font-semibold">
                                  {flight.end_percent}%
                                </span>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className={`h-full rounded-full ${
                                    flight.end_percent <= 20
                                      ? "bg-red-500"
                                      : flight.end_percent <= 40
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                  style={{
                                    width: `${flight.end_percent}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* DATE */}
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-medium text-slate-700">
                                {new Date(
                                  flight.flight_date
                                ).toLocaleDateString("id-ID")}
                              </p>

                              <p className="text-xs text-slate-400">
                                Flight Activity
                              </p>
                            </div>
                          </td>

                          {/* ACTION */}
                          <td className="px-5 py-4 text-center">
                            <Link
                              href={`/flights/${flight.flight_id}`}
                              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedFlight && (
        <FlightDetailModal
          // open={!!selectedFlight}
          data={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  );
}

function Card({ title, value, icon, bg }: any) {
  return (
    <div className="rounded-[28px] border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>

          <h1 className="mt-4 text-4xl leading-tight font-bold">{value}</h1>
        </div>

        <div className={`rounded-2xl p-4 ${bg}`}>{icon}</div>
      </div>
    </div>
  );
}
