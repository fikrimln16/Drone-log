"use client";

import Link from "next/link";

type Mission = {
  mission_name: string;

  total_flights: number;

  total_hours: number;

  avg_duration: number;

  last_activity: string;
};

type Props = {
  missions: Mission[];
};

export default function PilotMissionActivity({ missions }: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h1 className="text-2xl font-bold">Mission Activity</h1>

          <p className="mt-1 text-sm text-slate-500">
            Mission performance handled by pilot
          </p>
        </div>

        <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
          {missions.length} Missions
        </span>
      </div>

      {/* CONTENT */}
      <div className="max-h-[520px] space-y-4 overflow-y-auto p-6">
        {missions.map((mission) => (
          <Link
            key={mission.mission_name}
            href={`/missions/${encodeURIComponent(mission.mission_name)}`}
            className="block rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-200 hover:bg-cyan-50"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {mission.mission_name}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Last Activity :{" "}
                  {mission.last_activity
                    ? new Date(mission.last_activity).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  {mission.total_flights} Flights
                </div>

                <div className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                  {mission.total_hours} hr
                </div>

                <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                  {mission.avg_duration} min avg
                </div>
              </div>
            </div>
          </Link>
        ))}

        {missions.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            No mission activity found
          </div>
        )}
      </div>
    </div>
  );
}
