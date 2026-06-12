"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/layout/navbar";

import AmaStatsGrid from "@/components/ama/ama-stats-grid";

import AmaMapSection from "@/components/ama/section/ama-map-section";

import AmaDetailSection from "@/components/ama/ama-detail-section";

import AmaActivitySidebar from "@/components/ama/ama-activity-sidebar";

import Link from "next/link";

type Ama = {
  id: number;

  ama_name: string;

  latitude: number;

  longitude: number;

  status: string;

  total_flights: number;

  total_missions: number;

  last_flight: string;
};

export default function AmaPage() {
  const [amas, setAmas] = useState<Ama[]>([]);

  const [selectedAma, setSelectedAma] = useState<Ama | null>(null);

  const [statusFilter, setStatusFilter] = useState("ALL");

  async function fetchAmas() {
    try {
      const response = await fetch("/api/amas/summary");

      const data = await response.json();

      setAmas(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAmas();
  }, []);

  const stats = useMemo(() => {
    return {
      total: amas.length,

      success: amas.filter((x) => x.status === "SUCCESS").length,

      ongoing: amas.filter((x) => x.status === "ONGOING").length,

      pending: amas.filter((x) => x.status === "PENDING").length,
    };
  }, [amas]);

  const filteredAmas = useMemo(() => {
    if (statusFilter === "ALL") {
      return amas;
    }

    return amas.filter((item) => item.status === statusFilter);
  }, [amas, statusFilter]);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Navbar title="AMA Monitoring" subtitle="Operational area monitoring" />

      <div className="space-y-6 px-4 pt-[110px] pb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-100"
        >
          ← Back to Dashboard
        </Link>

        {/* STATS */}
        <AmaStatsGrid stats={stats} />

        {/* CONTENT */}
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1fr_380px]">
          {/* LEFT */}
          <div className="space-y-6">
            <AmaMapSection
              amas={filteredAmas}
              onSelectAma={(ama: Ama) => setSelectedAma(ama)}
            />

            <AmaDetailSection selectedAma={selectedAma} />
          </div>

          {/* RIGHT */}
          <AmaActivitySidebar
            amas={filteredAmas}
            selectedAma={selectedAma}
            setSelectedAma={setSelectedAma}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>
      </div>
    </div>
  );
}
