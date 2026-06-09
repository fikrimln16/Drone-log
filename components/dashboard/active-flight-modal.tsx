"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Plane, X, ChevronLeft, ChevronRight } from "lucide-react";

import FlightDetailModal from "../flights/flight-detail-modal";

type ActiveFlight = {
  id: number;

  flight_id: string;

  mission_name: string;

  ama: string;

  estate: string;

  latitude: number;

  longitude: number;

  battery_id: string;

  start_time: string;

  end_time: string;

  duration_min: number;

  end_percent: number;
};

type Props = {
  open: boolean;

  onClose: () => void;

  flights: ActiveFlight[];
};

export default function ActiveFlightsModal({ open, onClose, flights }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const rowsPerPage = 8;

  // =====================================================
  // BATTERY COLOR
  // =====================================================

  const getBatteryColor = (percent: number) => {
    if (percent <= 20) {
      return "bg-red-100 text-red-700";
    }

    if (percent <= 50) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.ceil(flights.length / rowsPerPage);

  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    const end = start + rowsPerPage;

    return flights.slice(start, end);
  }, [flights, currentPage]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        {/* ===================================================== */}
        {/* MODAL */}
        {/* ===================================================== */}

        <div className="flex h-[90vh] w-full max-w-[1600px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
          {/* ===================================================== */}
          {/* HEADER */}
          {/* ===================================================== */}

          <div className="flex items-center justify-between border-b px-8 py-6">
            {/* LEFT */}
            <div>
              <h1 className="text-3xl font-bold">Today's Active Flights</h1>

              <p className="mt-2 text-sm text-gray-500">
                Active flight operations on{" "}
                <span className="font-semibold text-black">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-100 px-5 py-3 text-sm font-semibold text-green-700">
                {flights.length} Active
              </div>

              <button
                onClick={onClose}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ===================================================== */}
          {/* TABLE */}
          {/* ===================================================== */}

          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[1650px] table-fixed">
              {/* ===================================================== */}
              {/* HEAD */}
              {/* ===================================================== */}

              <thead className="sticky top-0 z-10 border-b bg-gray-50">
                <tr>
                  <th className="min-w-[160px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    FLIGHT ID
                  </th>

                  <th className="min-w-[180px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    MISSION
                  </th>

                  <th className="min-w-[180px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    AMA
                  </th>

                  <th className="min-w-[180px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    ESTATE
                  </th>

                  <th className="min-w-[140px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    BATTERY
                  </th>

                  <th className="min-w-[120px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    START TIME
                  </th>

                  <th className="min-w-[120px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    END TIME
                  </th>

                  <th className="min-w-[120px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    DURATION
                  </th>

                  <th className="min-w-[140px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    END BATTERY
                  </th>

                  <th className="min-w-[160px] p-5 text-left text-xs font-bold tracking-wide whitespace-nowrap">
                    ACTION
                  </th>
                </tr>
              </thead>

              {/* ===================================================== */}
              {/* BODY */}
              {/* ===================================================== */}

              <tbody>
                {paginatedFlights.map((flight) => (
                  <tr
                    key={flight.id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    {/* FLIGHT */}
                    <td className="p-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
                          <Plane className="h-5 w-5 text-green-600" />
                        </div>

                        <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
                          {flight.flight_id}
                        </span>
                      </div>
                    </td>

                    {/* MISSION */}
                    <td className="p-5 whitespace-nowrap">
                      <Link
                        href={`/missions/${flight.mission_name}`}
                        className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-xs font-medium text-purple-700 transition hover:bg-purple-200"
                      >
                        {flight.mission_name}
                      </Link>
                    </td>

                    {/* AMA */}
                    <td className="p-5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-cyan-100 px-4 py-1 text-xs font-medium text-cyan-700">
                        {flight.ama}
                      </span>
                    </td>

                    {/* ESTATE */}
                    <td className="p-5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-xs font-medium text-orange-700">
                        {flight.estate}
                      </span>
                    </td>

                    {/* BATTERY */}
                    <td className="p-5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1 text-xs font-medium text-gray-700">
                        {flight.battery_id}
                      </span>
                    </td>

                    {/* START */}
                    <td className="p-5 text-sm font-medium whitespace-nowrap">
                      {flight.start_time}
                    </td>

                    {/* END */}
                    <td className="p-5 text-sm font-medium whitespace-nowrap">
                      {flight.end_time}
                    </td>

                    {/* DURATION */}
                    <td className="p-5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-4 py-1 text-xs font-medium text-yellow-700">
                        {flight.duration_min} min
                      </span>
                    </td>

                    {/* END BATTERY */}
                    <td className="p-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${getBatteryColor(
                          flight.end_percent
                        )}`}
                      >
                        {flight.end_percent}%
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedFlight(flight)}
                        className="inline-flex h-[38px] items-center justify-center rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}

                {/* EMPTY */}
                {paginatedFlights.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-24 text-center text-gray-400"
                    >
                      No active flights today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ===================================================== */}
          {/* PAGINATION */}
          {/* ===================================================== */}

          <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-8 py-5">
            {/* INFO */}
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-black">
                {(currentPage - 1) * rowsPerPage + 1}
              </span>
              –
              <span className="font-semibold text-black">
                {Math.min(currentPage * rowsPerPage, flights.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-black">{flights.length}</span>{" "}
              flights
            </p>

            {/* BUTTONS */}
            <div className="flex items-center gap-2">
              {/* PREV */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
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
                    className={`h-11 w-11 rounded-xl text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-gray-100"
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
                className="flex h-11 w-11 items-center justify-center rounded-xl border transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* DETAIL MODAL */}
      {/* ===================================================== */}

      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />
    </>
  );
}
