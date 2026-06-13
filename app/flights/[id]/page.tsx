"use client";

import Link from "next/link";

import { useParams } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import Navbar from "@/components/layout/navbar";

import useFlightDetail from "@/hooks/useFlightDetail";

import FlightHeroCard from "@/components/flights/detail/flight-hero-card";

import FlightSummaryCard from "@/components/flights/detail/flight-summary-card";

import FlightCrewCard from "@/components/flights/detail/flight-crew-card";

import FlightBatteryCard from "@/components/flights/detail/flight-battery-card";

import FlightTimelineCard from "@/components/flights/detail/flight-timeline-card";

import FlightAnalyticsCard from "@/components/flights/detail/flight-analytics-card";

import FlightNotesCard from "@/components/flights/detail/flight-notes-card";

import FlightMapCard from "@/components/flights/detail/flight-map-card";

import EditFlightModal from "@/components/flights/modals/edit-flight-modal";

import DeleteFlightModal from "@/components/flights/delete-flight-modal";

import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";

export default function FlightDetailPage() {
  const params = useParams();

  const flightId = params.id as string;

  const { data, loading } = useFlightDetail(flightId);

  const [openEditModal, setOpenEditModal] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const router = useRouter();

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <Navbar
          title="Flight Detail"
          subtitle="Loading flight information..."
        />

        <div className="px-5 pt-[120px] pb-10">
          <div className="animate-pulse space-y-5">
            <div className="h-[180px] rounded-[32px] bg-white" />

            <div className="grid gap-5 xl:grid-cols-12">
              <div className="space-y-5 xl:col-span-4">
                <div className="h-[250px] rounded-[28px] bg-white" />
                <div className="h-[180px] rounded-[28px] bg-white" />
                <div className="h-[260px] rounded-[28px] bg-white" />
              </div>

              <div className="xl:col-span-8">
                <div className="h-[700px] rounded-[28px] bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // NOT FOUND
  // ============================================

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Flight Not Found</h1>

          <p className="mt-2 text-gray-500">
            The requested flight could not be found.
          </p>

          <Link
            href="/flights"
            className="mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Back to Flights
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <>
      <div className="min-h-screen bg-[#f5f7fb]">
        {/* NAVBAR */}
        <Navbar title="Flight Detail" subtitle={data.flight_id} />

        <div className="px-5 pt-[120px] pb-10">
          {/* TOP ACTION */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* BACK */}
            <Link
              href="/flights"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Flights
            </Link>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenEditModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4" />
                Edit Flight
              </button>

              <button
                onClick={() => setOpenDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Flight
              </button>
            </div>
          </div>
          <FlightHeroCard data={data} />

          {/* CONTENT */}
          <div className="mt-4 grid gap-4 xl:grid-cols-12">
            <div className="space-y-5 xl:col-span-6">
              <FlightSummaryCard data={data} />

              <FlightBatteryCard data={data} />
            </div>

            <div className="space-y-5 xl:col-span-6">
              <FlightMapCard data={data} />
              <FlightCrewCard data={data} />

              <FlightNotesCard data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* EDIT MODAL */}
      {/* ===================================================== */}

      <EditFlightModal
        open={openEditModal}
        data={data}
        onClose={() => setOpenEditModal(false)}
        onSuccess={(updated) => {
          setOpenEditModal(false);

          window.location.reload();
        }}
      />

      {/* ===================================================== */}
      {/* DELETE MODAL */}
      {/* ===================================================== */}

      <DeleteFlightModal
        open={openDeleteModal}
        flight={data}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => {
          router.push("/flights");
        }}
      />
    </>
  );
}
