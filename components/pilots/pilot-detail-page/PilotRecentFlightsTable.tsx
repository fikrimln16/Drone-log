"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Props = {
  flights: any[];
};

export default function PilotRecentFlightsTable({ flights }: Props) {
  const [page, setPage] = useState(1);

  const perPage = 5;

  const paginatedFlights = useMemo(() => {
    const start = (page - 1) * perPage;

    return flights.slice(start, start + perPage);
  }, [flights, page]);

  const totalPages = Math.ceil(flights.length / perPage);

  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold">Recent Flights</h1>

        <p className="mt-1 text-sm text-slate-500">
          Latest pilot flight activity
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
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
            {paginatedFlights.map((flight: any) => (
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
                      <span className="text-xs text-slate-500">Remaining</span>

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
                      {new Date(flight.flight_date).toLocaleDateString("id-ID")}
                    </p>

                    <p className="text-xs text-slate-400">Flight Activity</p>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-6 py-4">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
