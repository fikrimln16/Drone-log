"use client";

import { useMemo, useState } from "react";

import PilotAnalyticsModal from "./pilot-analytics-modal";

import { ArrowDown, ArrowUp, Eye } from "lucide-react";

import PilotSortHeader from "./pilot-sort-header";

import Image from "next/image";

import Link from "next/link";

type Props = {
  pilots: any[];

  loading?: boolean;
};

type SortKey =
  | "pilot"
  | "performance"
  | "total_missions"
  | "total_flights"
  | "total_duration"
  | "avg_duration"
  | "last_flight"
  | "status";

export default function PilotTable({ pilots, loading }: Props) {
  // =====================================================
  // SORT
  // =====================================================

  const [sortBy, setSortBy] = useState<SortKey>("total_duration");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // =====================================================
  // ANALYTICS MODAL
  // =====================================================

  const [selectedPilot, setSelectedPilot] = useState<number | null>(null);

  const [analytics, setAnalytics] = useState<any>(null);

  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // =====================================================
  // HANDLE SORT
  // =====================================================

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("desc");
    }
  }

  // =====================================================
  // SORT DATA
  // =====================================================

  const sortedPilots = [...pilots].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // =====================================
    // PERFORMANCE
    // =====================================

    if (sortBy === "performance") {
      const monthA = Number(a.total_hours_this_month || 0);

      const monthB = Number(b.total_hours_this_month || 0);

      return sortDirection === "asc" ? monthA - monthB : monthB - monthA;
    }

    // =====================================
    // LAST FLIGHT
    // =====================================

    if (sortBy === "last_flight") {
      const aDate = aValue ? new Date(aValue).getTime() : 0;

      const bDate = bValue ? new Date(bValue).getTime() : 0;

      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    }

    // =====================================
    // STATUS
    // =====================================

    if (sortBy === "status") {
      const hoursA = Number(a.total_hours_this_month || 0);

      const hoursB = Number(b.total_hours_this_month || 0);

      return sortDirection === "asc" ? hoursA - hoursB : hoursB - hoursA;
    }

    // =====================================
    // NUMBER
    // =====================================

    if (
      sortBy === "total_missions" ||
      sortBy === "total_flights" ||
      sortBy === "total_duration" ||
      sortBy === "avg_duration"
    ) {
      return sortDirection === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    // =====================================
    // STRING
    // =====================================

    return sortDirection === "asc"
      ? String(aValue || "").localeCompare(String(bValue || ""))
      : String(bValue || "").localeCompare(String(aValue || ""));
  });

  // =====================================================
  // STATUS
  // =====================================================

  // =====================================================
  // SORT ICON
  // =====================================================

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

  function getPerformance(monthHours: number) {
    const target = 21;

    if (monthHours >= target) {
      return {
        label: "Target Achieved",
        subtitle: `${monthHours.toFixed(1)} hr logged`,
        className: "bg-green-100 text-green-700",
        dot: "bg-green-500",
      };
    }

    return {
      label: "Under Target",
      subtitle: `Need ${(target - monthHours).toFixed(1)} hr more`,
      className: "bg-yellow-100 text-yellow-700",
      dot: "bg-yellow-500",
    };
  }

  function getStatus(monthHours: number) {
    if (monthHours >= 25) {
      return {
        label: "Need Rest",
        subtitle: `${monthHours.toFixed(1)} hr this month`,
        className: "bg-red-100 text-red-700",
        dot: "bg-red-500",
      };
    }

    return {
      label: "Normal",
      subtitle: `${monthHours.toFixed(1)} hr this month`,
      className: "bg-green-100 text-green-700",
      dot: "bg-green-500",
    };
  }

  // =====================================================
  // ANALYTICS
  // =====================================================

  async function handleViewAnalytics(pilotId: number) {
    try {
      setLoadingAnalytics(true);

      setSelectedPilot(pilotId);

      const response = await fetch(`/api/pilots/${pilotId}`);

      const result = await response.json();

      setAnalytics(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAnalytics(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div className="flex flex-wrap items-center gap-3 border-b bg-slate-50 px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
            <div className="h-2 w-2 rounded-full bg-cyan-500" />
            Lifetime Metrics
          </div>

          <span className="text-xs text-slate-500">
            Missions, Flights, Hours, Avg Duration & Last Activity use all
            flight history
          </span>

          <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Monthly Metrics
          </div>

          <span className="text-xs text-slate-500">
            Performance & Status are calculated from the selected month only
          </span>
        </div>
        <table className="w-full min-w-[1200px]">
          {/* ================================================= */}
          {/* HEAD */}
          {/* ================================================= */}

          <thead className="border-b bg-slate-50">
            <tr>
              <PilotSortHeader
                label="PILOT"
                field="pilot"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="w-[320px]"
              />

              <PilotSortHeader
                label="MISSIONS"
                field="total_missions"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <PilotSortHeader
                label="FLIGHTS"
                field="total_flights"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <PilotSortHeader
                label="HOURS"
                field="total_duration"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <PilotSortHeader
                label="AVG"
                field="avg_duration"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <PilotSortHeader
                label="LAST ACTIVITY"
                field="last_flight"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <PilotSortHeader
                label="PERFORMANCE"
                field="performance"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <PilotSortHeader
                label="STATUS"
                field="status"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
              />

              <th className="px-6 py-5 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">
                Action
              </th>
            </tr>
          </thead>

          {/* ================================================= */}
          {/* BODY */}
          {/* ================================================= */}

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-20 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              sortedPilots.map((pilot: any) => {
                const totalHours = Number(pilot.total_duration || 0) / 60;

                const monthHours = Number(pilot.total_hours_this_month || 0);

                const performance = getPerformance(monthHours);

                const status = getStatus(monthHours);

                return (
                  <tr
                    key={pilot.id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    {/* PILOT */}
                    <td className="px-6 py-5">
                      <div className="flex min-w-[260px] items-center gap-4">
                        <div className="h-14 min-h-14 w-14 min-w-14 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-100 shadow-sm">
                          {pilot.photo_url ? (
                            <Image
                              src={pilot.photo_url}
                              alt={pilot.pilot}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-cyan-100 text-lg font-black text-cyan-700">
                              {pilot.pilot?.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h1
                            className="line-clamp-2 text-base font-bold text-slate-900"
                            title={pilot.pilot}
                          >
                            {pilot.pilot}
                          </h1>

                          <p className="mt-1 text-xs text-slate-500">
                            {pilot.total_flights} Flights •{" "}
                            {pilot.total_missions} Missions
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-xs font-bold text-purple-700">
                        {pilot.total_missions} missions
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-xs font-bold text-cyan-700">
                        {pilot.total_flights} flights
                      </span>
                    </td>

                    {/* AMA COVERAGE */}
                    {/* <td className="px-6 py-5">
                      <div>
                        <div className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                          {pilot.ama_coverage}
                        </div>

                        {pilot.ama_list?.length > 0 && (
                          <p
                            className="mt-2 max-w-[180px] truncate text-xs text-slate-500"
                            title={pilot.ama_list.join(", ")}
                          >
                            {pilot.ama_list.join(", ")}
                          </p>
                        )}
                      </div>
                    </td> */}

                    {/* TOTAL HOURS */}
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <h1 className="font-bold text-slate-900">
                          {pilot.total_hours} hr
                        </h1>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="font-semibold text-slate-800">
                        {Number(pilot.avg_duration).toFixed(1)} min
                      </span>
                    </td>

                    {/* LAST ACTIVITY */}
                    <td className="px-6 py-5 text-center">
                      {pilot.last_flight ? (
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-slate-800">
                            {new Date(pilot.last_flight).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>

                          <span className="mt-1 text-xs text-slate-500">
                            Last Flight
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          No Activity
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${performance.className}`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${performance.dot}`}
                          />

                          {performance.label}
                        </div>

                        <span className="mt-2 text-xs text-slate-500">
                          {performance.subtitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${status.className}`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${status.dot}`}
                          />

                          {status.label}
                        </div>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 text-center">
                      <Link
                        href={`/pilots/${pilot.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        <Eye className="h-4 w-4" />
                        View Analytics
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <PilotAnalyticsModal
        open={!!selectedPilot}
        data={analytics}
        loading={loadingAnalytics}
        onClose={() => {
          setSelectedPilot(null);

          setAnalytics(null);
        }}
      />
    </div>
  );
}
