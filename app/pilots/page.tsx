"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Navbar from "@/components/layout/navbar";

import PilotCard from "@/components/pilots/pilot-card";

import PilotTable from "@/components/pilots/pilot-table";

export default function PilotsPage() {
  const [pilots, setPilots] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<any>(null);
  async function fetchSummary() {
    try {
      const res = await fetch("/api/pilots/summary");

      const data = await res.json();

      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPilots();
    fetchSummary();
  }, []);

  async function fetchPilots() {
    try {
      const res = await fetch("/api/pilots");

      const data = await res.json();

      setPilots(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const totalPilots = pilots.length;

  const totalDuration = pilots.reduce(
    (acc, item) => acc + Number(item.total_duration || 0),
    0
  );

  const totalFlights = pilots.reduce(
    (acc, item) => acc + Number(item.total_flights || 0),
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <PilotCard
            title="Total Pilots"
            value={summary?.total_pilots || 0}
            color="blue"
          />

          <PilotCard
            title="Active Pilots"
            value={summary?.active_pilots || 0}
            subtitle="This Month"
            color="purple"
          />

          <PilotCard
            title="Flight Hours"
            value={`${summary?.total_hours || 0} hr`}
            color="yellow"
          />

          <PilotCard
            title="Top Pilot"
            value={summary?.top_pilot?.pilot_name || "-"}
            subtitle={`${summary?.top_pilot?.total_flights || 0} Flights`}
            image={summary?.top_pilot?.photo_url}
            color="cyan"
          />

          <PilotCard
            title="Most flight hours this month"
            value={summary?.flight_hours_leader?.pilot_name || "-"}
            subtitle={`${(
              Number(summary?.flight_hours_leader?.duration || 0) / 60
            ).toFixed(1)} hr this month`}
            image={summary?.flight_hours_leader?.photo_url}
            color="red"
          />

          <PilotCard
            title="AMA Coverage"
            value={`${summary?.ama_coverage?.covered || 0}/${
              summary?.ama_coverage?.total || 0
            }`}
            subtitle="Covered AMA"
            color="green"
          />
        </div>

        {/* TABLE */}
        <PilotTable pilots={pilots} loading={loading} />
      </div>
    </div>
  );
}
