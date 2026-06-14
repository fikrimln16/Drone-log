"use client";

import Image from "next/image";
import { Users, Plane } from "lucide-react";

type Props = {
  data: any;
};

export default function FlightCrewCard({ data }: Props) {
  const pilots = Array.isArray(data?.pilots) ? data.pilots : [];

  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-100 p-3">
            <Users className="h-5 w-5 text-cyan-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Flight Crew</h1>

            <p className="text-sm text-slate-500">
              {pilots.length} Pilot Assigned
            </p>
          </div>
        </div>

        {/* AVATAR STACK */}
        {pilots.length > 0 && (
          <div className="flex -space-x-3">
            {pilots.slice(0, 4).map((pilot: any) => (
              <div
                key={pilot.id}
                className="overflow-hidden rounded-full border-2 border-white shadow"
              >
                {pilot.photo_url ? (
                  <Image
                    src={pilot.photo_url}
                    alt={pilot.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center bg-cyan-100 font-bold text-cyan-700">
                    {pilot.name?.charAt(0)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* CREW LIST */}
      {/* ================================================= */}

      <div className="mt-6 space-y-3">
        {pilots.length > 0 ? (
          pilots.map((pilot: any, index: number) => (
            <div
              key={pilot.id}
              className="group flex items-center justify-between rounded-2xl border bg-slate-50 p-4 transition hover:border-cyan-200 hover:bg-cyan-50"
            >
              <div className="flex items-center gap-4">
                {/* PHOTO */}
                <div className="overflow-hidden rounded-2xl border-2 border-cyan-100 shadow-sm">
                  {pilot.photo_url ? (
                    <Image
                      src={pilot.photo_url}
                      alt={pilot.name}
                      width={56}
                      height={56}
                      className="h-14 w-14 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center bg-cyan-100 text-lg font-black text-cyan-700">
                      {pilot.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Pilot #{index + 1}
                  </p>

                  <h1 className="font-bold text-slate-900">{pilot.name}</h1>
                </div>
              </div>

              {/* BADGE */}
              <div className="flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                <Plane className="h-3.5 w-3.5" />
                Flight Crew
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">No pilot assigned</p>
          </div>
        )}
      </div>
    </div>
  );
}
