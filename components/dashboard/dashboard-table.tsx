"use client";

import Link from "next/link";

import { useMemo, useState } from "react";

import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  missions: any[];
};

type SortKey =
  | "mission_name"
  | "last_flight"
  | "total_flights"
  | "total_duration"
  | "avg_duration";

export default function DashboardTable({ missions }: Props) {
  // SORT
  const [sortBy, setSortBy] = useState<SortKey>("last_flight");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // SORTED DATA
  const sortedMissions = useMemo(() => {
    return [...missions].sort((a, b) => {
      const valueA = a[sortBy];

      const valueB = b[sortBy];

      // ============================================
      // DATE SORT
      // ============================================

      if (sortBy === "last_flight") {
        const dateA = new Date(valueA).getTime();

        const dateB = new Date(valueB).getTime();

        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      // ============================================
      // NUMBER SORT
      // ============================================

      if (
        sortBy === "total_flights" ||
        sortBy === "total_duration" ||
        sortBy === "avg_duration"
      ) {
        return sortDirection === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      // ============================================
      // STRING SORT
      // ============================================

      return sortDirection === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [missions, sortBy, sortDirection]);

  // HANDLE SORT
  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("desc");
    }
  }

  // SORT ICON
  function SortIcon({ column }: { column: SortKey }) {
    if (sortBy !== column) {
      return <ArrowDown className="h-4 w-4 text-gray-300" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-[28px] border bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Mission Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Flight mission activity overview
            </p>
          </div>

          <div className="mx-3 rounded-full bg-cyan-100 px-4 py-2 text-xs font-semibold text-cyan-700">
            {missions.length} Missions
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          {/* HEADER */}
          <thead className="border-b bg-slate-50">
            <tr>
              <th
                onClick={() => handleSort("mission_name")}
                className="cursor-pointer px-6 py-5 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
              >
                <div className="flex items-center gap-2">
                  Mission
                  <SortIcon column="mission_name" />
                </div>
              </th>

              <th
                onClick={() => handleSort("last_flight")}
                className="cursor-pointer px-6 py-5 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
              >
                <div className="flex items-center gap-2">
                  Last Activity
                  <SortIcon column="last_flight" />
                </div>
              </th>

              <th
                onClick={() => handleSort("total_flights")}
                className="cursor-pointer px-6 py-5 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
              >
                <div className="flex items-center gap-2">
                  Flights
                  <SortIcon column="total_flights" />
                </div>
              </th>

              <th
                onClick={() => handleSort("total_duration")}
                className="cursor-pointer px-6 py-5 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
              >
                <div className="flex items-center gap-2">
                  Duration
                  <SortIcon column="total_duration" />
                </div>
              </th>

              <th
                onClick={() => handleSort("avg_duration")}
                className="cursor-pointer px-6 py-5 text-left text-xs font-bold tracking-wider text-slate-500 uppercase"
              >
                <div className="flex items-center gap-2">
                  Avg Duration
                  <SortIcon column="avg_duration" />
                </div>
              </th>

              <th className="px-6 py-5 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">
                Action
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {sortedMissions.map((item) => (
              <tr
                key={item.mission_name}
                className="border-b transition-all duration-200 hover:bg-cyan-50/40"
              >
                {/* MISSION */}
                <td className="px-6 py-5">
                  <div className="max-w-[280px]">
                    <h1
                      className="truncate font-bold text-slate-900"
                      title={item.mission_name}
                    >
                      {item.mission_name}
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">Drone Mission</p>
                  </div>
                </td>

                {/* LAST ACTIVITY */}
                <td className="px-6 py-5">
                  <div className="inline-flex flex-col rounded-2xl bg-slate-50 px-4 py-2">
                    <span className="font-semibold text-slate-800">
                      {new Date(item.last_flight).toLocaleDateString("id-ID")}
                    </span>

                    <span className="text-[11px] text-slate-500">
                      Latest Activity
                    </span>
                  </div>
                </td>

                {/* FLIGHTS */}
                <td className="px-6 py-5">
                  <div className="inline-flex items-center rounded-2xl bg-purple-50 px-4 py-2">
                    <span className="font-bold text-purple-700">
                      {item.total_flights}
                    </span>

                    <span className="ml-2 text-sm text-purple-500">
                      Flights
                    </span>
                  </div>
                </td>

                {/* TOTAL DURATION */}
                <td className="px-6 py-5">
                  <div className="inline-flex items-center rounded-2xl bg-yellow-50 px-4 py-2">
                    <span className="font-bold text-yellow-700">
                      {item.total_duration}
                    </span>

                    <span className="ml-2 text-sm text-yellow-600">min</span>
                  </div>
                </td>

                {/* AVG DURATION */}
                <td className="px-6 py-5">
                  <div className="inline-flex rounded-2xl bg-green-50 px-4 py-2">
                    <span className="font-semibold text-green-700">
                      {item.avg_duration} min
                    </span>
                  </div>
                </td>

                {/* ACTION */}
                <td className="px-6 py-5 text-center">
                  <Link
                    href={`/missions/${encodeURIComponent(item.mission_name)}`}
                    className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}

            {sortedMissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center text-slate-400">
                  No missions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
