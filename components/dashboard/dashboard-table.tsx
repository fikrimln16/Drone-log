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

        return sortDirection === "asc"
          ? dateA - dateB
          : dateB - dateA;
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
        ? String(valueA).localeCompare(
            String(valueB)
          )
        : String(valueB).localeCompare(
            String(valueA)
          );
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
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      {/* RESPONSIVE WRAPPER */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[850px]">
          {/* HEAD */}
          <thead className="border-b bg-gray-50">
            <tr>
              {/* MISSION */}
              <th
                onClick={() => handleSort("mission_name")}
                className="cursor-pointer px-4 py-5 text-left text-xs font-bold whitespace-nowrap transition hover:bg-gray-100 md:px-6 md:text-sm"
              >
                <div className="flex items-center gap-2">
                  MISSION
                  <SortIcon column="mission_name" />
                </div>
              </th>

              {/* LAST FLIGHT */}
              <th
                onClick={() => handleSort("last_flight")}
                className="cursor-pointer px-4 py-5 text-left text-xs font-bold whitespace-nowrap transition hover:bg-gray-100 md:px-6 md:text-sm"
              >
                <div className="flex items-center gap-2">
                  LAST FLIGHT
                  <SortIcon column="last_flight" />
                </div>
              </th>

              {/* FLIGHTS */}
              <th
                onClick={() => handleSort("total_flights")}
                className="cursor-pointer px-4 py-5 text-left text-xs font-bold whitespace-nowrap transition hover:bg-gray-100 md:px-6 md:text-sm"
              >
                <div className="flex items-center gap-2">
                  FLIGHTS
                  <SortIcon column="total_flights" />
                </div>
              </th>

              {/* TOTAL DURATION */}
              <th
                onClick={() => handleSort("total_duration")}
                className="cursor-pointer px-4 py-5 text-left text-xs font-bold whitespace-nowrap transition hover:bg-gray-100 md:px-6 md:text-sm"
              >
                <div className="flex items-center gap-2">
                  TOTAL DURATION
                  <SortIcon column="total_duration" />
                </div>
              </th>

              {/* AVG */}
              <th
                onClick={() => handleSort("avg_duration")}
                className="cursor-pointer px-4 py-5 text-left text-xs font-bold whitespace-nowrap transition hover:bg-gray-100 md:px-6 md:text-sm"
              >
                <div className="flex items-center gap-2">
                  AVG DURATION
                  <SortIcon column="avg_duration" />
                </div>
              </th>

              {/* ACTION */}
              <th className="px-4 py-5 text-right text-xs font-bold whitespace-nowrap md:px-6 md:text-sm">
                ACTION
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {sortedMissions.map((item) => (
              <tr
                key={item.mission_name}
                className="border-b transition hover:bg-gray-50"
              >
                {/* MISSION */}
                <td className="px-4 py-5 md:px-6">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 md:px-4 md:text-sm">
                    {item.mission_name}
                  </span>
                </td>

                {/* LAST */}
                <td className="px-4 py-5 text-sm whitespace-nowrap md:px-6 md:text-base">
                  {new Date(item.last_flight).toLocaleDateString("id-ID")}
                </td>

                {/* FLIGHTS */}
                <td className="px-4 py-5 md:px-6">
                  <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700 md:px-4 md:text-sm">
                    {item.total_flights} flights
                  </span>
                </td>

                {/* TOTAL */}
                <td className="px-4 py-5 md:px-6">
                  <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700 md:px-4 md:text-sm">
                    {item.total_duration} min
                  </span>
                </td>

                {/* AVG */}
                <td className="px-4 py-5 text-sm whitespace-nowrap md:px-6 md:text-base">
                  {item.avg_duration} min
                </td>

                {/* ACTION */}
                <td className="px-4 py-5 text-right md:px-6">
                  <Link
                    href={`/missions/${item.mission_name}`}
                    className="inline-flex rounded-xl border bg-white px-4 py-2 text-xs transition hover:bg-gray-100 md:rounded-2xl md:px-5 md:text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {/* EMPTY */}
            {sortedMissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center text-gray-400">
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
