"use client";

import { useState } from "react";

import Navbar from "../layout/navbar";

import MissionHeader from "./mission-header";

import MissionTable from "./mission-table";

import AddFlightModal from "../flights/modals/add-flight-model";

import DeleteFlightModal from "../flights/delete-flight-modal";

import EditFlightModal from "../flights/modals/edit-flight-modal";

import FlightDetailModal from "../flights/flight-detail-modal";

import ExportCSVModal from "../export/export-csv-modal";

import useMissionFlights from "@/hooks/useMissionFlight";

import useMissionSort from "@/hooks/useMissionSort";

import MissionKpiGrid from "./kpi/mission-kpi-grid";

import usePagination from "@/hooks/usePagination";

import Footer from "../layout/footer";

type Props = {
  mission: string;
};

export default function MissionPage({ mission }: Props) {
  // FETCH
  const { flights, setFlights } = useMissionFlights(mission);

  // SORT
  const { sortedFlights, handleSort, sortBy, sortDirection } =
    useMissionSort(flights);

  // MODAL
  const [openAdd, setOpenAdd] = useState(false);

  const [openExport, setOpenExport] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const [deleteFlight, setDeleteFlight] = useState<any>(null);

  const [editFlight, setEditFlight] = useState<any>(null);

  // PAGINATION
  const { paginatedData, currentPage, setCurrentPage, totalPages } =
    usePagination(sortedFlights, 5);

  return (
    <div className="min-w-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar title="Flight Check" subtitle="UAV Flight Log Manager" />

      {/* CONTENT */}
      <div className="mx-auto w-full px-4 pt-[105px] pb-4 md:px-6 xl:max-w-[1600px] xl:px-8">
        {/* HEADER */}
        <MissionHeader
          mission={mission}
          totalFlights={flights.length}
          onOpenExport={() => setOpenExport(true)}
          onAdd={() => setOpenAdd(true)}
        />

        {/* KPI */}
        <MissionKpiGrid flights={flights} />

        {/* TABLE */}
        <MissionTable
          flights={paginatedData}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          onDetail={(item) => setSelectedFlight(item)}
          onEdit={(item) => setEditFlight(item)}
          onDelete={(item) => setDeleteFlight(item)}
        />
        {/* PAGINATION */}
        <div className="mt-3 flex items-center justify-between">
          {/* INFO */}
          <p className="text-sm text-gray-500">
            Page <span className="font-semibold text-black">{currentPage}</span>{" "}
            of <span className="font-semibold text-black">{totalPages}</span>
          </p>

          {/* BUTTON */}
          <div className="flex items-center gap-2">
            {/* PREVIOUS */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
            >
              Previous
            </button>

            {/* PAGE NUMBER */}
            {Array.from({
              length: totalPages,
            }).map((_, index) => {
              const page = index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-xl border text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  } `}
                >
                  {page}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL */}
      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />

      {/* ADD */}
      <AddFlightModal
        mission={mission}
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      />

      {/* EXPORT */}
      <ExportCSVModal
        open={openExport}
        flights={flights}
        onClose={() => setOpenExport(false)}
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

      {/* EDIT */}
      <EditFlightModal
        open={!!editFlight}
        data={editFlight}
        onClose={() => setEditFlight(null)}
        onSuccess={(updated) => {
          setFlights((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }}
      />

      <Footer />
    </div>
  );
}
