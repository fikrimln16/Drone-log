"use client";

import { Battery, Clock3, Plane, Timer, Trophy, User } from "lucide-react";

import MissionKpiCard from "./mission-kpi-card";

type Props = {
  flights: any[];
};

export default function MissionKpiGrid({ flights }: Props) {
  // TOTAL
  const totalFlights = flights.length;

  const totalDuration = flights.reduce(
    (acc, item) => acc + Number(item.duration_min || 0),
    0
  );

  const avgDuration =
    totalFlights > 0 ? (totalDuration / totalFlights).toFixed(1) : 0;

  // TOP PILOT
  const pilotMap: Record<
    string,
    {
      flights: number;
      duration: number;
    }
  > = {};

  flights.forEach((flight) => {
    const pilots = flight.pilots || [];

    pilots.forEach((pilot: string) => {
      if (!pilot) return;

      if (!pilotMap[pilot]) {
        pilotMap[pilot] = {
          flights: 0,
          duration: 0,
        };
      }

      pilotMap[pilot].flights += 1;

      pilotMap[pilot].duration += Number(flight.duration_min || 0);
    });
  });

  const topPilot = Object.entries(pilotMap).sort(
    (a, b) => b[1].duration - a[1].duration
  )[0];

  // BATTERY EFFICIENCY
  const batteryUsage = flights.reduce((acc, item) => {
    return acc + (Number(item.start_percent) - Number(item.end_percent));
  }, 0);

  const avgBatteryUsage =
    totalFlights > 0 ? (batteryUsage / totalFlights).toFixed(1) : 0;

  // LONGEST FLIGHT
  const longestFlight = [...flights].sort(
    (a, b) => Number(b.duration_min) - Number(a.duration_min)
  )[0];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {/* TOTAL */}
      <MissionKpiCard
        title="Total Flights"
        value={totalFlights}
        subtitle="Total recorded flights"
        icon={<Plane className="h-7 w-7 text-blue-600" />}
      />

      {/* TOTAL DURATION */}
      <MissionKpiCard
        title="Total Duration"
        value={`${totalDuration} min`}
        subtitle="Total mission duration"
        icon={<Clock3 className="h-7 w-7 text-green-600" />}
      />

      {/* AVG */}
      <MissionKpiCard
        title="Avg Duration"
        value={`${avgDuration} min`}
        subtitle="Average flight duration"
        icon={<Timer className="h-7 w-7 text-yellow-600" />}
      />

      {/* TOP PILOT */}
      <MissionKpiCard
        title="Most Active Pilot"
        value={topPilot?.[0] || "-"}
        subtitle={`${topPilot?.[1]?.flights || 0} flights • ${
          topPilot?.[1]?.duration || 0
        } min`}
        icon={<Trophy className="h-7 w-7 text-purple-600" />}
      />

      {/* BATTERY */}
      <MissionKpiCard
        title="Battery Efficiency"
        value={`${avgBatteryUsage}%`}
        subtitle="Average battery usage"
        icon={<Battery className="h-7 w-7 text-orange-600" />}
      />

      {/* LONGEST */}
      <MissionKpiCard
        title="Longest Flight"
        value={longestFlight?.flight_id || "-"}
        subtitle={`${longestFlight?.duration_min || 0} min duration`}
        icon={<User className="h-7 w-7 text-cyan-600" />}
      />
    </div>
  );
}
