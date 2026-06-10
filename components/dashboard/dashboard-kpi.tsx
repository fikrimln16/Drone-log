"use client";

import { FolderKanban, Plane, Clock3, Timer } from "lucide-react";

import StatsCard from "./stats-card";

type Props = {
  stats: any;
};

export default function DashboardKPI({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {/* TOTAL MISSIONS */}
      <StatsCard
        title="TOTAL MISSIONS"
        value={stats.total_missions || 0}
        trend={`+${stats.mission_growth || 0}%`}
        subtitle="vs last month"
        icon={<FolderKanban className="h-7 w-7 text-blue-600" />}
        iconBg="bg-blue-100"
      />

      {/* TOTAL FLIGHTS */}
      <StatsCard
        title="TOTAL FLIGHTS"
        value={stats.total_flights || 0}
        trend={`+${stats.flight_growth || 0}%`}
        subtitle="vs last month"
        icon={<Plane className="h-7 w-7 text-purple-600" />}
        iconBg="bg-purple-100"
      />

      {/* TOTAL DURATION */}
      <StatsCard
        title="TOTAL DURATION"
        value={`${stats.total_duration || 0} min`}
        trend={`+${stats.duration_growth || 0}%`}
        subtitle="vs last month"
        icon={<Clock3 className="h-7 w-7 text-yellow-600" />}
        iconBg="bg-yellow-100"
      />

      {/* AVG */}
      <StatsCard
        title="AVG DURATION"
        value={`${stats.avg_duration || 0} min`}
        trend={`${stats.avg_growth || 0}%`}
        subtitle="vs last month"
        icon={<Timer className="h-7 w-7 text-green-600" />}
        iconBg="bg-green-100"
      />
    </div>
  );
}
