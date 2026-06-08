"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Navbar from "@/components/layout/navbar";

import PilotCard from "@/components/pilots/pilot-card";

import PilotTable from "@/components/pilots/pilot-table";

export default function PilotsPage() {
  const [pilots, setPilots] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchPilots();
  }, []);

  async function fetchPilots() {
    try {
      const res = await fetch(
        "/api/pilots"
      );

      const data =
        await res.json();

      setPilots(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const totalPilots =
    pilots.length;

  const totalDuration =
  pilots.reduce(
    (acc, item) =>
      acc +
      Number(item.total_duration || 0),
    0
  );

  const totalFlights =
  pilots.reduce(
    (acc, item) =>
      acc +
      Number(item.total_flights || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar
        title="Pilot Management"
        subtitle="Monitor pilot rotation and workload"
      />

      {/* CONTENT */}
      <div className="space-y-6 px-4 pt-[120px] pb-10">
        {/* BACK */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-100"
        >
          ← Back to Dashboard
        </Link>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <PilotCard
            title="Total Pilots"
            value={totalPilots}
            color="blue"
          />

          <PilotCard
            title="Total Flights"
            value={totalFlights}
            color="purple"
          />

          <PilotCard
            title="Total Duration"
            value={`${totalDuration} min`}
            color="yellow"
          />

          <PilotCard
            title="Average Duration"
            value={`${
            totalFlights > 0
               ? Math.round(
                  totalDuration /
                     totalFlights
                  )
               : 0
            } min`}
            color="green"
          />
        </div>

        {/* TABLE */}
        <PilotTable
          pilots={pilots}
          loading={loading}
        />
      </div>
    </div>
  );
}