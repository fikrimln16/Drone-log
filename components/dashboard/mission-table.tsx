"use client";

import Link from "next/link";

import { useState } from "react";

import dynamic from "next/dynamic";

// COMPONENTS
import Navbar from "../layout/navbar";

import DashboardCharts from "../dashboard-charts";

import UploadCSV from "../upload-csv";

import ActiveFlightsModal from "./active-flight-modal";

import DashboardKPI from "./dashboard-kpi";

import DashboardOperation from "./dashboard-operation";

import DashboardTable from "./dashboard-table";

import DashboardPageSkeleton from "../skeleton/dashboard-page-skeleton";

import Footer from "../layout/footer";

import AddFlightModal from "../flights/modals/add-flight-model";

// ICONS
import {
  List,
  Plus,
  MapPinned,
  Radar,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

// HOOKS
import useDashboardData from "@/hooks/useDashboardData";

import useMissionFilter from "@/hooks/useMissionFilter";

import usePagination from "@/hooks/usePagination";

// MAP
const AmaMonitorMap = dynamic(() => import("../maps/ama-monitor-map"), {
  ssr: false,
});

export default function MissionTable() {
  // SEARCH
  const [search, setSearch] = useState("");

  // ACTIVE MODAL
  const [openActiveModal, setOpenActiveModal] = useState(false);

  // ADD FLIGHT
  const [openAddFlight, setOpenAddFlight] = useState(false);

  // FETCH DATA
  const { missions, stats, loading } = useDashboardData();

  // FILTER
  const filteredMissions = useMissionFilter({
    missions,

    search,

    sortBy: "last_flight",

    sortDirection: "desc",
  });

  // PAGINATION
  const { paginatedData, currentPage, setCurrentPage, totalPages } =
    usePagination(filteredMissions, 5);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar title="Mission Dashboard" subtitle="Drone Flight Management" />

      {/* CONTENT */}
      <div className="w-full px-5 pt-[120px] pb-6 md:px-6 xl:px-7">
        <div className="mx-auto w-full">
          {loading ? (
            <DashboardPageSkeleton />
          ) : (
            <div className="space-y-6">
              {/* KPI */}
              <DashboardKPI stats={stats} />

              {/* OPERATION */}
              <DashboardOperation
                stats={stats}
                onOpenActive={() => setOpenActiveModal(true)}
              />

              <AmaMonitorMap />

              {/* ACTION */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* SEARCH */}
                <div className="relative w-full md:w-[420px]">
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);

                      setCurrentPage(1);
                    }}
                    placeholder="Search mission..."
                    className="h-[54px] w-full rounded-2xl border bg-white px-5 text-sm transition outline-none focus:border-blue-500 md:text-base"
                  />
                </div>

                {/* RIGHT ACTION */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* ALL FLIGHTS */}
                  <Link
                    href="/flights"
                    className="flex h-[54px] items-center gap-3 rounded-2xl border bg-white px-5 shadow-sm transition hover:bg-gray-100"
                  >
                    {/* ICON */}
                    <div className="rounded-xl bg-blue-100 p-2">
                      <List className="h-4 w-4 text-blue-600" />
                    </div>

                    {/* TEXT */}
                    <div className="text-left">
                      <p className="text-sm font-semibold">All Flights</p>

                      <p className="text-xs text-gray-500">
                        View all flight logs
                      </p>
                    </div>
                  </Link>

                  {/* ADD FLIGHT */}
                  <button
                    onClick={() => setOpenAddFlight(true)}
                    className="flex h-[54px] items-center gap-3 rounded-2xl border bg-white px-5 shadow-sm transition hover:bg-gray-100"
                  >
                    {/* ICON */}
                    <div className="rounded-xl bg-purple-100 p-2">
                      <Plus className="h-4 w-4 text-purple-600" />
                    </div>

                    {/* TEXT */}
                    <div className="text-left">
                      <p className="text-sm font-semibold text-black">
                        Add Flight
                      </p>

                      <p className="text-xs text-gray-500">
                        Create new flight log
                      </p>
                    </div>
                  </button>

                  {/* UPLOAD */}
                  <UploadCSV />
                </div>
              </div>

              {/* TABLE */}
              <DashboardTable missions={paginatedData} />

              {/* PAGINATION */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* INFO */}
                <p className="text-sm text-gray-500">
                  Page{" "}
                  <span className="font-semibold text-black">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-black">{totalPages}</span>
                </p>

                {/* BUTTON */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* PREVIOUS */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-xl border bg-white px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
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
                            ? "bg-black text-white"
                            : "bg-white hover:bg-gray-100"
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
                    className="rounded-xl border bg-white px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE MODAL */}
      <ActiveFlightsModal
        open={openActiveModal}
        onClose={() => setOpenActiveModal(false)}
        flights={stats.active_flight_list || []}
      />

      {/* ADD FLIGHT MODAL */}
      <AddFlightModal
        mission=""
        open={openAddFlight}
        onClose={() => setOpenAddFlight(false)}
      />

      <Footer />
    </div>
  );
}
