"use client";

import { Battery, Clock3, Plane, Timer, Users, Trophy } from "lucide-react";

import MissionKpiCard from "./mission-kpi-card";

type Props = {
  flights: any[];
};

export default function MissionKpiGrid({ flights }: Props) {
  const totalFlights = flights.length;

  const totalDuration = flights.reduce(
    (acc, item) => acc + Number(item.duration_min || 0),
    0
  );

  const avgDuration =
    totalFlights > 0 ? (totalDuration / totalFlights).toFixed(1) : "0";

  // =====================================
  // PILOT INVOLVED
  // =====================================

  const uniquePilots = new Set<string>();

  flights.forEach((flight) => {
    (flight.pilots || []).forEach((pilot: string) => {
      if (pilot) uniquePilots.add(pilot);
    });
  });

  const pilotCount = uniquePilots.size;

  // =====================================
  // BATTERY
  // =====================================

  const batteryUsage = flights.reduce((acc, item) => {
    return (
      acc + (Number(item.start_percent || 0) - Number(item.end_percent || 0))
    );
  }, 0);

  const avgBatteryUsage =
    totalFlights > 0 ? (batteryUsage / totalFlights).toFixed(1) : "0";

  // =====================================
  // LONGEST FLIGHT
  // =====================================

  const longestFlight = [...flights].sort(
    (a, b) => Number(b.duration_min) - Number(a.duration_min)
  )[0];

  const pilotList = [...uniquePilots];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <MissionKpiCard
        title="Total Flights"
        value={totalFlights}
        subtitle="Total recorded flights"
        icon={<Plane className="h-7 w-7 text-blue-600" />}
      />

      <MissionKpiCard
        title="Total Duration"
        value={`${totalDuration} min`}
        subtitle="Total mission duration"
        icon={<Clock3 className="h-7 w-7 text-green-600" />}
      />

      <MissionKpiCard
        title="Avg Duration"
        value={`${avgDuration} min`}
        subtitle="Average flight duration"
        icon={<Timer className="h-7 w-7 text-yellow-600" />}
      />

      <div className="rounded-[28px] border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-100 p-3">
            <Users className="h-6 w-6 text-cyan-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold">Pilots Involved</h1>

            <p className="text-sm text-slate-500">
              Flight crews in this mission
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {pilotList.map((pilot) => (
            <span
              key={pilot}
              className="rounded-full bg-cyan-100 px-3 py-2 text-sm font-semibold text-cyan-700"
            >
              {pilot}
            </span>
          ))}
        </div>
      </div>

      <MissionKpiCard
        title="Battery Efficiency"
        value={`${avgBatteryUsage}%`}
        subtitle="Average battery usage"
        icon={<Battery className="h-7 w-7 text-orange-600" />}
      />

      <MissionKpiCard
        title="Longest Flight"
        value={longestFlight?.flight_id || "-"}
        subtitle={`${longestFlight?.duration_min || 0} min duration`}
        icon={<Trophy className="h-7 w-7 text-cyan-600" />}
      />
    </div>
  );
}
