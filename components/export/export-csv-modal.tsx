"use client";

import { useState } from "react";

import {
  Download,
  Loader2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import FlightDetailModal from "../flights/flight-detail-modal";

import useExportFilter from "./userExportFilter";

import ExportFilter from "./export-filter";

import ExportTable from "./export-table";

import { generateCSV } from "./export-utils";

type Props = {
  open: boolean;

  flights: any[];

  onClose: () => void;
};

export default function ExportCSVModal({
  open,
  flights,
  onClose,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [selectedFlight, setSelectedFlight] =
    useState<any>(null);

  // FILTER
  const filters =
    useExportFilter(flights);

  // EXPORT
  async function handleExport() {
    try {
      setLoading(true);

      // UX DELAY
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      // CSV CONTENT
      const csvContent = generateCSV(
        filters.filteredFlights
      );

      // BLOB
      const blob = new Blob(
        [csvContent],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

      // FILE NAME
      const today = new Date();

      const fileName = `FLIGHT_EXPORT_${
        today
          .toISOString()
          .split("T")[0]
      }.csv`;

      // DOWNLOAD
      const link =
        document.createElement("a");

      const url =
        URL.createObjectURL(blob);

      link.href = url;

      link.download = fileName;

      link.click();

      URL.revokeObjectURL(url);

      toast.success(
        "CSV exported successfully"
      );

      // AUTO CLOSE
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      console.error(error);

      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/40 p-3 backdrop-blur-sm md:p-4">
        <div className="flex min-h-full items-center justify-center">
          {/* MODAL */}
          <div className="flex max-h-[92vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl md:rounded-[32px]">
            {/* HEADER */}
            <div className="flex items-start justify-between border-b px-5 py-5 md:px-8 md:py-6">
              <div>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                  Export Flight CSV
                </h1>

                <p className="mt-2 text-sm text-gray-500 md:text-base">
                  Filter and preview
                  flight data before
                  exporting
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
              {/* FILTER */}
              <ExportFilter
                filters={filters}
              />

              {/* TABLE */}
              <ExportTable
                flights={
                  filters.filteredFlights
                }
                onDetail={(item) =>
                  setSelectedFlight(item)
                }
              />
            </div>

            {/* FOOTER */}
            <div className="flex flex-col gap-4 border-t bg-white px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
              {/* TOTAL */}
              <p className="text-center text-sm text-gray-500 md:text-left">
                {
                  filters.filteredFlights
                    .length
                }{" "}
                flights selected
              </p>

              {/* ACTION */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                {/* CANCEL */}
                <button
                  onClick={onClose}
                  className="rounded-2xl border px-5 py-3 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                {/* EXPORT */}
                <button
                  disabled={
                    filters
                      .filteredFlights
                      .length === 0 ||
                    loading
                  }
                  onClick={handleExport}
                  className="flex min-w-[190px] items-center justify-center gap-3 rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      Export CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <FlightDetailModal
        data={selectedFlight}
        onClose={() =>
          setSelectedFlight(null)
        }
      />
    </>
  );
}