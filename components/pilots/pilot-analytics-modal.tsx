"use client";

import { Clock3, Plane, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import FlightDetailModal from "../flights/flight-detail-modal";

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
    if (duration >= 600) {
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

  const status = getStatus(Number(summary?.total_duration || 0));

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="relative flex max-h-[92vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}
        <div className="border-b px-8 py-7">
          <div className="flex items-center gap-5">
            {/* AVATAR */}
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-cyan-100 text-3xl font-bold text-cyan-700">
              {summary?.pilot?.charAt(0)}
            </div>

            {/* INFO */}
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-gray-400 uppercase">
                Pilot Analytics
              </p>

              <h1 className="mt-2 text-5xl font-bold">{summary?.pilot}</h1>

              <div
                className={`mt-3 inline-flex rounded-full px-4 py-1 text-sm font-semibold ${status.className}`}
              >
                {status.label}
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
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                <h2 className="text-2xl font-bold">Mission Activity</h2>

                <div className="mt-6 space-y-4">
                  {data?.missions?.map((item: any) => (
                    <div
                      key={item.mission_name}
                      className="flex items-center justify-between rounded-2xl border bg-gray-50 p-4"
                    >
                      <div>
                        <p className="font-bold">{item.mission_name}</p>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.total} flights
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
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

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Flight ID
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Mission
                        </th>

                        <th>AMA</th>
                        <th>UAV</th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Duration
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Battery
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Date
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data?.recent_flights?.map((flight: any) => (
                        <tr key={flight.flight_id} className="border-b">
                          <td className="px-4 py-4 font-semibold">
                            {flight.flight_id}
                          </td>

                          <td className="px-4 py-4">{flight.mission_name}</td>

                          <td className="px-4 py-4">{flight.ama}</td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                              {flight.uav_unit}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {flight.duration_min} min
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              {flight.end_percent}%
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            {new Date(flight.flight_date).toLocaleDateString(
                              "id-ID"
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => setSelectedFlight(flight)}
                              className="rounded-xl border bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
                            >
                              Detail
                            </button>
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
