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

  total_flights: number;

  total_missions: number;

  total_amas: number;

  total_duration: number;

  total_duration_this_month: number;

  avg_duration: number;

  total_hours: string;

  total_hours_this_month: string;

  status: string;

  ama_coverage: string;

  ama_list: string[];
};

type SortField =
  | "pilot"
  | "total_missions"
  | "total_flights"
  | "total_hours"
  | "total_hours_this_month"
  | "avg_duration"
  | "status";

export default function PilotSummaryTable() {
  const [data, setData] = useState<Pilot[]>([]);

  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);

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

  // =====================================================
  // FETCH
  // =====================================================

  async function fetchData() {
    try {
      const response = await fetch("/api/dashboard/pilot-summary");

      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleOpenPilot(pilot: string) {
    console.log(pilot);
    try {
      setAnalyticsOpen(true);

      setAnalyticsLoading(true);

      const response = await fetch(`/api/pilots/${encodeURIComponent(pilot)}`);

      const result = await response.json();

      setAnalyticsData(result);
      // console.log(result);

      setSelectedPilot(pilot);
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

        case "total_missions":
          valueA = a.total_missions;

          valueB = b.total_missions;

          break;

        case "total_flights":
          valueA = a.total_flights;

          valueB = b.total_flights;

          break;

        case "total_hours":
          valueA = Number(a.total_hours);

          valueB = Number(b.total_hours);

          break;

        case "total_hours_this_month":
          valueA = Number(a.total_hours_this_month);
          valueB = Number(b.total_hours_this_month);
          break;

        case "avg_duration":
          valueA = a.avg_duration;

          valueB = b.avg_duration;

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

  function getStatusStyle(status: string) {
    switch (status) {
      case "NEED REST":
        return {
          bg: "bg-red-100",

          text: "text-red-700",

          icon: <ShieldAlert className="h-4 w-4" />,
        };

      case "UNDER TARGET":
        return {
          bg: "bg-yellow-100",

          text: "text-yellow-700",

          icon: <TriangleAlert className="h-4 w-4" />,
        };

      default:
        return {
          bg: "bg-green-100",

          text: "text-green-700",

          icon: <ShieldCheck className="h-4 w-4" />,
        };
    }
  }

  return (
    <div className="rounded-[32px] border border-gray-200 bg-white shadow-sm">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="border-b border-gray-100 px-7 py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* LEFT */}
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-blue-600 uppercase">
              Pilot Analytics
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Pilot Performance Summary
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Flight activity, fatigue monitoring, and operational coverage
            </p>
          </div>

          {/* SEARCH */}
          <Link
            href="/pilots"
            className="flex min-w-[200px] items-center gap-3 rounded-[20px] border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* ICON */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100">
              <ChartColumn className="h-5 w-5 text-cyan-600" />
            </div>

            {/* TEXT */}
            <div>
              <h1 className="text-base leading-none font-bold">All Pilots</h1>

              <p className="mt-1 text-xs text-gray-500">View analytics</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1600px] table-fixed">
          <thead>
            <tr className="border-b bg-gray-50/80 text-left">
              {/* PILOT */}
              <th
                onClick={() => handleSort("pilot")}
                className="w-[220px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                  PILOT
                  {renderSortIcon("pilot")}
                </div>
              </th>

              {/* MISSION */}
              <th
                onClick={() => handleSort("total_missions")}
                className="w-[140px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                  MISSION
                  {renderSortIcon("total_missions")}
                </div>
              </th>

              {/* AMA */}
              <th className="w-[260px] px-6 py-5">
                <div className="text-sm font-bold whitespace-nowrap">
                  AMA COVERAGE
                </div>
              </th>

              {/* FLIGHTS */}
              <th
                onClick={() => handleSort("total_flights")}
                className="w-[140px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                  FLIGHTS
                  {renderSortIcon("total_flights")}
                </div>
              </th>

              {/* HOURS */}
              <th
                onClick={() => handleSort("total_hours")}
                className="w-[180px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                  HOURS
                  {renderSortIcon("total_hours")}
                </div>
              </th>

              {/* THIS MONTH */}
              <th
                onClick={() => handleSort("total_hours_this_month")}
                className="w-[180px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                  THIS MONTH
                  {renderSortIcon("total_hours_this_month")}
                </div>
              </th>

              {/* AVG */}
              <th
                onClick={() => handleSort("avg_duration")}
                className="w-[160px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                  AVG DURATION
                  {renderSortIcon("avg_duration")}
                </div>
              </th>

              {/* STATUS */}
              <th
                onClick={() => handleSort("status")}
                className="w-[180px] cursor-pointer px-6 py-5"
              >
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                  STATUS
                  {renderSortIcon("status")}
                </div>
              </th>

              {/* ACTION */}
              <th className="w-[140px] px-6 py-5">
                <div className="text-sm font-bold whitespace-nowrap">
                  ACTION
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((item, index) => {
              const style = getStatusStyle(item.status);

              return (
                <tr
                  key={index}
                  className="border-b transition hover:bg-gray-50"
                  style={{
                    height: 88,
                  }}
                >
                  {/* PILOT */}
                  <td className="px-6 py-5">
                    <div className="flex min-w-[260px] items-center gap-4">
                      {/* PHOTO */}
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-100 bg-white shadow-sm">
                        {item.photo_url &&
                        item.photo_url !== "null" &&
                        item.photo_url.trim() !== "" ? (
                          <Image
                            src={item.photo_url}
                            alt={item.pilot}
                            width={56}
                            height={56}
                            className="h-14 w-14 object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center bg-cyan-100 text-lg font-black text-cyan-700">
                            {item.pilot.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="min-w-0">
                        <h1
                          className="line-clamp-2 text-base font-bold text-slate-900"
                          title={item.pilot}
                        >
                          {item.pilot}
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                          Drone Pilot
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-700">
                            {item.total_flights} Flights
                          </span>

                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                            {item.total_hours} hr
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* MISSION */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                      {item.total_missions} Missions
                    </div>
                  </td>

                  {/* AMA */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <div className="w-fit rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700">
                        {item.ama_coverage}
                      </div>

                      {item.ama_list?.length ? (
                        <p
                          className="mt-2 max-w-[220px] truncate text-xs text-gray-500"
                          title={item.ama_list.join(", ")}
                        >
                          {item.ama_list.join(", ")}
                        </p>
                      ) : (
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                          No AMA Coverage
                        </span>
                      )}
                    </div>
                  </td>

                  {/* FLIGHTS */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                      {item.total_flights} Flights
                    </div>
                  </td>

                  {/* HOURS */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div>
                      <h1 className="font-bold">{item.total_hours} hr</h1>

                      <div className="mt-2 h-2 w-[120px] overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            Number(item.total_hours) > 160
                              ? "bg-red-500"
                              : Number(item.total_hours) < 120
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (Number(item.total_hours) / 160) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* THIS MONTH */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    {Number(item.total_hours_this_month) > 0 ? (
                      <div>
                        <h1 className="font-bold text-sky-700">
                          {item.total_hours_this_month} hr
                        </h1>

                        <p className="mt-1 text-xs text-gray-500">
                          Current month
                        </p>

                        <div className="mt-2 h-2 w-[120px] overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-sky-500"
                            style={{
                              width: `${Math.min(
                                (Number(item.total_hours_this_month) / 40) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                          ✈️ No Flight
                        </div>

                        <p className="text-xs text-gray-400">
                          No activity this month
                        </p>
                      </div>
                    )}
                  </td>

                  {/* AVG */}
                  <td className="px-6 py-5 font-semibold">
                    {Number(item.avg_duration).toFixed(1)} min
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div
                      className={`flex w-[130px] items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${style.bg} ${style.text}`}
                    >
                      {style.icon}

                      {item.status}
                    </div>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-5 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenPilot(item.id)}
                      className="flex w-fit items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                      Detail
                    </button>
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

          setSelectedPilot(null);
        }}
      />
    </div>
  );
}
