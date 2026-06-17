"use client";

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Search,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import usePagination from "@/hooks/usePagination";

import { ChartColumn, Users } from "lucide-react";

import PilotAnalyticsModal from "../pilots/pilot-analytics-modal";

import Image from "next/image";

type Pilot = {
  id: number;

  pilot: string;

  total_flights_this_month: number;

  total_missions_this_month: number;

  total_amas: number;

  total_duration: number;

  total_duration_this_month: number;

  avg_duration_this_month: number;

  total_hours: string;

  total_hours_this_month: string;

  last_flight: string | null;

  status: string;

  ama_coverage: string;

  ama_list: string[];

  photo_url?: string | null;
};

type SortField =
  | "pilot"
  | "performance"
  | "total_missions_this_month"
  | "total_flights_this_month"
  | "total_hours"
  | "avg_duration_this_month"
  | "last_flight"
  | "status";

export default function PilotSummaryTable() {
  const [data, setData] = useState<Pilot[]>([]);

  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // SORT
  // =====================================================

  const [sortBy, setSortBy] = useState<SortField>("total_hours");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // =====================================================
  // FETCH
  // =====================================================

  async function fetchData() {
    try {
      const response = await fetch(
        `/api/dashboard/pilot-summary?month=${selectedMonth}`
      );
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  async function handleOpenPilot(pilot: string) {
    console.log(pilot);
    try {
      setAnalyticsOpen(true);

      setAnalyticsLoading(true);

      const response = await fetch(`/api/pilots/${encodeURIComponent(pilot)}`);

      const result = await response.json();

      setAnalyticsData(result);
      // console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredData = useMemo(() => {
    let result = [...data];

    // ============================================
    // SEARCH
    // ============================================

    if (search) {
      result = result.filter((item) => {
        return (
          item.pilot.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase()) ||
          item.ama_list.some((ama) =>
            ama.toLowerCase().includes(search.toLowerCase())
          )
        );
      });
    }

    // ============================================
    // SORT
    // ============================================

    result.sort((a, b) => {
      let valueA: any;

      let valueB: any;

      switch (sortBy) {
        case "pilot":
          valueA = a.pilot;

          valueB = b.pilot;

          break;

        case "performance":
          valueA = Number(a.total_hours_this_month || 0);
          valueB = Number(b.total_hours_this_month || 0);
          break;

        case "total_missions_this_month":
          valueA = a.total_missions_this_month;

          valueB = b.total_missions_this_month;

          break;

        case "total_flights_this_month":
          valueA = a.total_flights_this_month;

          valueB = b.total_flights_this_month;

          break;

        case "total_hours":
          valueA = Number(a.total_hours_this_month);
          valueB = Number(b.total_hours_this_month);
          break;

        // case "total_hours_this_month":
        //   valueA = Number(a.total_hours_this_month);
        //   valueB = Number(b.total_hours_this_month);
        //   break;

        case "avg_duration_this_month":
          valueA = a.avg_duration_this_month;

          valueB = b.avg_duration_this_month;

          break;

        case "last_flight":
          valueA = a.last_flight ? new Date(a.last_flight).getTime() : 0;

          valueB = b.last_flight ? new Date(b.last_flight).getTime() : 0;

          break;

        case "status":
          valueA = a.status;

          valueB = b.status;

          break;

        default:
          return 0;
      }

      if (typeof valueA === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });

    return result;
  }, [data, search, sortBy, sortDirection]);

  const { paginatedData, currentPage, setCurrentPage, totalPages } =
    usePagination(filteredData, 5);

  // =====================================================
  // SORT HANDLER
  // =====================================================

  function handleSort(field: SortField) {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);

      setSortDirection("desc");
    }
  }

  // =====================================================
  // SORT ICON
  // =====================================================

  function renderSortIcon(field: SortField) {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  }

  // =====================================================
  // STATUS STYLE
  // =====================================================

  function getPerformance(monthHours: number) {
    const target = 21;

    if (monthHours >= target) {
      return {
        label: "Target Achieved",
        subtitle: `${monthHours.toFixed(1)} hr this month`,
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
      };
    }

    return {
      label: "Under Target",
      subtitle: `${(target - monthHours).toFixed(1)} hr remaining`,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
    };
  }

  function getStatus(totalHours: number) {
    if (totalHours > 21) {
      return {
        label: "High Load",
        subtitle: `${totalHours.toFixed(1)} hr logged`,
        bg: "bg-red-100",
        text: "text-red-700",
        dot: "bg-red-500",
      };
    }

    return {
      label: "Normal",
      subtitle: `${totalHours.toFixed(1)} hr logged`,
      bg: "bg-green-100",
      text: "text-green-700",
      dot: "bg-green-500",
    };
  }

  const periodLabel = new Date(`${selectedMonth}-01`).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white shadow-sm">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="border-b border-gray-100 px-7 py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}
          <div>
            <div className="mb-3 inline-flex items-center rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-700">
              SELECTED PERIOD • {periodLabel}
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              Pilot Performance Summary
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-gray-500">
              Operational performance overview including completed missions,
              total flights, flight hours, average flight duration, and pilot
              activity for {periodLabel}.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-12 rounded-2xl border border-gray-200 px-4"
            />

            <Link
              href="/pilots"
              className="flex min-w-[280px] items-center gap-3 rounded-[20px] border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
                <ChartColumn className="h-5 w-5 text-cyan-600" />
              </div>

              <div>
                <h1 className="text-base leading-none font-bold">
                  Pilot Analytics
                </h1>

                <p className="mt-1 text-xs text-gray-500">
                  Explore all-time flights, missions, flight hours, and pilot
                  statistics
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1600px] table-fixed">
          <thead className="border-b bg-slate-50">
            <tr>
              {/* PILOT */}
              <th
                onClick={() => handleSort("pilot")}
                className="w-[320px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  PILOT
                  {renderSortIcon("pilot")}
                </div>
              </th>

              {/* PERFORMANCE */}
              <th
                onClick={() => handleSort("performance")}
                className="w-[220px] cursor-pointer px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                  PERFORMANCE
                  {renderSortIcon("performance")}
                </div>
              </th>

              {/* MISSIONS */}
              <th
                onClick={() => handleSort("total_missions_this_month")}
                className="w-[180px] cursor-pointer px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                  MISSIONS
                  {renderSortIcon("total_missions_this_month")}
                </div>
              </th>

              {/* FLIGHTS */}
              <th
                onClick={() => handleSort("total_flights_this_month")}
                className="w-[180px] cursor-pointer px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                  FLIGHTS
                  {renderSortIcon("total_flights_this_month")}
                </div>
              </th>

              {/* HOURS */}
              <th
                onClick={() => handleSort("total_hours")}
                className="w-[180px] cursor-pointer px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                  HOURS
                  {renderSortIcon("total_hours")}
                </div>
              </th>

              {/* AVG */}
              <th
                onClick={() => handleSort("avg_duration_this_month")}
                className="w-[160px] cursor-pointer px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                  AVG DURATION
                  {renderSortIcon("avg_duration_this_month")}
                </div>
              </th>

              {/* LAST ACTIVITY */}
              <th
                onClick={() => handleSort("last_flight")}
                className="w-[180px] cursor-pointer px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                  LAST ACTIVITY
                  {renderSortIcon("last_flight")}
                </div>
              </th>

              {/* STATUS */}
              {/* <th
                onClick={() => handleSort("status")}
                className="w-[180px] cursor-pointer px-6 py-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-700">
                  STATUS
                  {renderSortIcon("status")}
                </div>
              </th> */}

              {/* ACTION */}
              <th className="w-[160px] px-6 py-5 text-center">
                <div className="text-sm font-bold text-slate-700">ACTION</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((pilot: any) => {
              const monthHours = Number(pilot.total_hours_this_month || 0);

              const totalHours = Number(pilot.total_hours || 0);

              const performance = getPerformance(monthHours);

              const status = getStatus(totalHours);

              return (
                <tr
                  key={pilot.id}
                  className="border-b transition hover:bg-slate-50"
                >
                  {/* PILOT */}
                  <td className="px-6 py-5">
                    <div className="flex min-w-[260px] items-center gap-4">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-100 bg-white shadow-sm">
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

                      <div>
                        <h1 className="font-bold text-slate-900">
                          {pilot.pilot}
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                          Drone Pilot
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* PERFORMANCE */}
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${performance.bg} ${performance.text}`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${performance.dot}`}
                        />

                        {performance.label}
                      </div>
                    </div>
                  </td>

                  {/* MISSIONS */}
                  <td className="px-6 py-5 text-center">
                    {Number(pilot.total_missions_this_month) > 0 ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        {pilot.total_missions_this_month} Missions
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                        No Missions
                      </div>
                    )}
                  </td>

                  {/* FLIGHTS */}
                  <td className="px-6 py-5 text-center">
                    {Number(pilot.total_flights_this_month) > 0 ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        {pilot.total_flights_this_month} Flights
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                        No Flights
                      </div>
                    )}
                  </td>

                  {/* HOURS */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <h1 className="font-bold text-slate-900">
                        {pilot.total_hours_this_month} hr
                      </h1>

                      <div className="mt-2 w-[120px]">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              totalHours > 21 ? "bg-red-500" : "bg-cyan-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (pilot.total_hours_this_month / 21) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        {/* SCALE */}
                        <div className="mt-1 flex justify-between text-[10px] font-medium text-slate-400">
                          <span>0 hr</span>
                          <span>21 hr</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* AVG */}
                  <td className="px-6 py-5 text-center">
                    {Number(pilot.avg_duration_this_month || 0) > 0 ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                        {Number(pilot.avg_duration_this_month).toFixed(1)} min
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
                        <div className="h-2 w-2 rounded-full bg-slate-400" />
                        No Data
                      </div>
                    )}
                  </td>

                  {/* LAST ACTIVITY */}
                  <td className="px-6 py-5 text-center">
                    {pilot.last_flight ? (
                      <div>
                        <h1 className="font-semibold text-slate-800">
                          {new Date(pilot.last_flight).toLocaleDateString(
                            "id-ID"
                          )}
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                          Last Flight
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        No Activity
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
                  {/* <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${status.bg} ${status.text}`}
                      >
                        <div className={`h-2 w-2 rounded-full ${status.dot}`} />

                        {status.label}
                      </div>

                      <span className="mt-2 text-xs text-slate-500">
                        {status.subtitle}
                      </span>
                    </div>
                  </td> */}

                  {/* ACTION */}
                  <td className="px-6 py-5 text-center">
                    <Link
                      href={`/pilots/${pilot.id}`}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                    >
                      View Analytics
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ===================================================== */}
        {/* PAGINATION */}
        {/* ===================================================== */}

        <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          {/* INFO */}
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-black">
              {paginatedData.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-black">
              {filteredData.length}
            </span>{" "}
            pilots
          </p>

          {/* BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            {/* PREVIOUS */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
            >
              Previous
            </button>

            {/* PAGE */}
            {Array.from({
              length: totalPages,
            }).map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-xl border text-sm font-medium transition ${
                    currentPage === page
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>

        {/* EMPTY */}
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-lg font-bold">No pilot data found</h1>

            <p className="mt-2 text-sm text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
      <PilotAnalyticsModal
        open={analyticsOpen}
        data={analyticsData}
        loading={analyticsLoading}
        onClose={() => {
          setAnalyticsOpen(false);

          setAnalyticsData(null);
        }}
      />
    </div>
  );
}
