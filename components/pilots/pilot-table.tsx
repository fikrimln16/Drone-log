"use client";

import { useMemo, useState } from "react";

import PilotAnalyticsModal from "./pilot-analytics-modal";

import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  pilots: any[];

  loading: boolean;
};

type SortKey =
  | "pilot"
  | "total_duration"
  | "total_flights"
  | "total_missions"
  | "last_flight";

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

  const sortedPilots = useMemo(() => {
    return [...(pilots || [])].sort((a, b) => {
      const valueA = a?.[sortBy];

      const valueB = b?.[sortBy];

      // DATE
      if (sortBy === "last_flight") {
        const dateA = valueA ? new Date(valueA).getTime() : 0;

        const dateB = valueB ? new Date(valueB).getTime() : 0;

        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      // NUMBER
      if (
        sortBy === "total_duration" ||
        sortBy === "total_flights" ||
        sortBy === "total_missions"
      ) {
        return sortDirection === "asc"
          ? Number(valueA || 0) - Number(valueB || 0)
          : Number(valueB || 0) - Number(valueA || 0);
      }

      // STRING
      return sortDirection === "asc"
        ? String(valueA || "").localeCompare(String(valueB || ""))
        : String(valueB || "").localeCompare(String(valueA || ""));
    });
  }, [pilots, sortBy, sortDirection]);

  // =====================================================
  // STATUS
  // =====================================================

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
        <table className="w-full min-w-[900px] table-fixed">
          {/* ================================================= */}
          {/* HEAD */}
          {/* ================================================= */}

          <thead className="border-b bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort("pilot")}
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  PILOT
                  <SortIcon column="pilot" />
                </div>
              </th>

              <th
                onClick={() => handleSort("total_duration")}
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  TOTAL HOURS
                  <SortIcon column="total_duration" />
                </div>
              </th>

              <th
                onClick={() => handleSort("total_flights")}
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  FLIGHTS
                  <SortIcon column="total_flights" />
                </div>
              </th>

              <th
                onClick={() => handleSort("total_missions")}
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  MISSIONS
                  <SortIcon column="total_missions" />
                </div>
              </th>

              <th
                onClick={() => handleSort("last_flight")}
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  LAST FLIGHT
                  <SortIcon column="last_flight" />
                </div>
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold">STATUS</th>

              <th className="px-6 py-5 text-right text-sm font-bold">ACTION</th>
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
                const duration = Number(pilot.total_duration || 0);

                const status = getStatus(duration);

                return (
                  <tr
                    key={pilot.id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    {/* PILOT */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 font-bold text-cyan-700">
                          {pilot.pilot?.[0] || "P"}
                        </div>

                        <div>
                          <p className="font-bold">{pilot.pilot}</p>

                          <p className="text-sm text-gray-500">Drone Pilot</p>
                        </div>
                      </div>
                    </td>

                    {/* HOURS */}
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-semibold text-yellow-700">
                        {(duration / 60).toFixed(1)} hr
                      </span>
                    </td>

                    {/* FLIGHTS */}
                    <td className="px-6 py-5">{pilot.total_flights}</td>

                    {/* MISSIONS */}
                    <td className="px-6 py-5">{pilot.total_missions}</td>

                    {/* LAST FLIGHT */}
                    <td className="px-6 py-5">
                      {pilot.last_flight
                        ? new Date(pilot.last_flight).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleViewAnalytics(pilot.id)}
                        className="rounded-2xl border bg-white px-5 py-2 text-sm transition hover:bg-gray-100"
                      >
                        View Analytics
                      </button>
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
