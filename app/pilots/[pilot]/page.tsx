"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/layout/navbar";

import PilotHeaderSection from "@/components/pilots/pilot-detail-page/PilotHeaderSection";
import PilotStatsCards from "@/components/pilots/pilot-detail-page/PilotStatsCard";
import PilotPerformanceSection from "@/components/pilots/pilot-detail-page/PilotPerformanceSection";
import PilotWorkloadSection from "@/components/pilots/pilot-detail-page/PilotWorkloadSection";
import PilotMissionTable from "@/components/pilots/pilot-detail-page/PilotMissionTable";
import PilotRecentFlightsTable from "@/components/pilots/pilot-detail-page/PilotRecentFlightsTable";

export default function PilotAnalyticsPage() {
  const params = useParams();

  const pilotId = params.pilot as string;

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (pilotId) {
      fetchData();
    }
  }, [pilotId]);

  async function fetchData() {
    try {
      const res = await fetch(`/api/pilots/${pilotId}`);

      const json = await res.json();

      setData(json);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!data?.summary) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const { summary, missions, recent_flights } = data;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Navbar title="Pilot Analytics" subtitle={summary.pilot} />

      <div className="mx-auto max-w-[1500px] px-4 pt-[105px] pb-8 md:px-6 xl:px-8">
        <PilotHeaderSection summary={summary} />

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <PilotPerformanceSection summary={summary} />
          <PilotWorkloadSection summary={summary} />
        </div>

        <div className="mt-6">
          <PilotRecentFlightsTable flights={recent_flights} />
        </div>

        <div className="mt-6">
          <PilotMissionTable missions={missions} />
        </div>
      </div>
    </div>
  );
}
