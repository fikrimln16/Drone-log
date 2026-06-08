"use client";

import Link from "next/link";

import Navbar from "../layout/navbar";

import UploadCSV from "../upload-csv";

import { useState } from "react";

import useFlights from "@/hooks/flights/useFlights";

import useFlightFilters from "@/hooks/flights/useFlightFilters";

import useFlightSort from "@/hooks/flights/useFlightSort";

import FlightsFilter from "./filters/flights-filter";

import ExportCSVModal from "../export/export-csv-modal";

import FlightsTable from "./table/flight-table";

import FlightDetailModal from "../flights/flight-detail-modal";

import EditFlightModal from "../flights/modals/edit-flight-modal";

import DeleteFlightModal from "../flights/delete-flight-modal";

import usePagination from "@/hooks/usePagination";

import Pagination from "../ui/pagination";

export default function AllFlightsPage() {
  // FETCH
  const { flights, setFlights } = useFlights();
  // FILTER
  const filter = useFlightFilters(flights);

  // SORT
  const sort = useFlightSort(filter.filteredFlights);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const [editFlight, setEditFlight] = useState<any>(null);

  const [deleteFlight, setDeleteFlight] = useState<any>(null);

  // EXPORT MODAL
  const [openExport, setOpenExport] = useState(false);

  // OPTIONS
  const missionOptions = [...new Set(flights.map((item) => item.mission_name))];

  const amaOptions = [...new Set(flights.map((item) => item.ama))];

  const estateOptions = [...new Set(flights.map((item) => item.estate))];

  const batteryOptions = [...new Set(flights.map((item) => item.battery_id))];

  // PAGINATION
  const { paginatedData, currentPage, setCurrentPage, totalPages } =
    usePagination(sort.sortedFlights, 5);

  const pilotOptions = [
    ...new Set(flights.map((item) => item.pilot).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar title="All Flights" subtitle="Complete drone flight history" />

      {/* CONTENT */}
      <div className="space-y-5 px-4 pt-[120px] pb-8">
        {/* BACK */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-100"
        >
          ← Back to Dashboard
        </Link>

        {/* FILTER */}
        <FlightsFilter
          search={filter.search}
          setSearch={filter.setSearch}
          startDate={filter.startDate}
          setStartDate={filter.setStartDate}
          endDate={filter.endDate}
          setEndDate={filter.setEndDate}
          selectedMission={filter.selectedMission}
          setSelectedMission={filter.setSelectedMission}
          selectedAma={filter.selectedAma}
          setSelectedAma={filter.setSelectedAma}
          selectedEstate={filter.selectedEstate}
          setSelectedEstate={filter.setSelectedEstate}
          selectedBattery={filter.selectedBattery}
          setSelectedBattery={filter.setSelectedBattery}
          selectedPilot={filter.selectedPilot}
          setSelectedPilot={filter.setSelectedPilot}
          missionOptions={missionOptions}
          amaOptions={amaOptions}
          estateOptions={estateOptions}
          batteryOptions={batteryOptions}
          pilotOptions={pilotOptions}
          resetFilters={filter.resetFilters}
        />

        {/* ACTION */}
        <div className="flex items-center justify-end gap-3">
          {/* EXPORT */}
          <button
            onClick={() => setOpenExport(true)}
            className="rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-100"
          >
            Export CSV
          </button>

          {/* UPLOAD */}
          <UploadCSV />
        </div>

        {/* TABLE */}
        <FlightsTable
          flights={paginatedData}
          sortBy={sort.sortBy}
          sortDirection={sort.sortDirection}
          onSort={sort.handleSort}
          onDetail={(item) => setSelectedFlight(item)}
          onEdit={(item) => setEditFlight(item)}
          onDelete={(item) => setDeleteFlight(item)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* EXPORT MODAL */}
      <ExportCSVModal
        open={openExport}
        flights={sort.sortedFlights}
        onClose={() => setOpenExport(false)}
      />

      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />

      <EditFlightModal
        open={!!editFlight}
        data={editFlight}
        onClose={() => setEditFlight(null)}
        onSuccess={(updated) => {
          setFlights((prev: any[]) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );

          setEditFlight(null);
        }}
      />

      {/* DELETE */}
      <DeleteFlightModal
        open={!!deleteFlight}
        flight={deleteFlight}
        onClose={() => setDeleteFlight(null)}
        onDelete={(deletedId) => {
          setFlights((prev) => prev.filter((item) => item.id !== deletedId));

          setDeleteFlight(null);
        }}
      />
    </div>
  );
}
