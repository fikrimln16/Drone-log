"use client";

import { FolderKanban, Plane, Clock3, Timer } from "lucide-react";

import StatsCard from "./stats-card";

type Props = {
  stats: any;
};

export default function DashboardKPI({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Missions"
        value={stats.total_missions || 0}
        trend={`${stats.mission_growth || 0}%`}
        subtitle="vs last month"
        icon={<FolderKanban className="h-6 w-6 text-blue-600" />}
        iconBg="bg-blue-100"
      />

      <StatsCard
        title="Total Flights"
        value={stats.total_flights || 0}
        trend={`${stats.flight_growth || 0}%`}
        subtitle="vs last month"
        icon={<Plane className="h-6 w-6 text-purple-600" />}
        iconBg="bg-purple-100"
      />

      <StatsCard
        title="Total Duration"
        value={`${stats.total_duration || 0} min`}
        trend={`${stats.duration_growth || 0}%`}
        subtitle="vs last month"
        icon={<Clock3 className="h-6 w-6 text-yellow-600" />}
        iconBg="bg-yellow-100"
      />

      <StatsCard
        title="Avg Duration"
        value={`${stats.avg_duration || 0} min`}
        trend={`${stats.avg_growth || 0}%`}
        subtitle="vs last month"
        icon={<Timer className="h-6 w-6 text-green-600" />}
        iconBg="bg-green-100"
      />
    </div>
  );
}
