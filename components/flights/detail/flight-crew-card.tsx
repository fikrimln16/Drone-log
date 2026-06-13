"use client";

import { Users, User } from "lucide-react";

type Props = {
  data: any;
};

export default function FlightCrewCard({ data }: Props) {
  const pilots = Array.isArray(data.pilots) ? data.pilots : [];

  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      {/* HEADER */}
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

      {/* CREW SUMMARY */}
      {/* <div className="mt-5 rounded-2xl border bg-slate-50 p-4">
        <p className="text-xs font-medium text-slate-500">Total Crew</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {pilots.length}
        </h1>
      </div> */}

      {/* PILOTS */}
      <div className="mt-5 space-y-3">
        {pilots.length > 0 ? (
          pilots.map((pilot: string, index: number) => (
            <div
              key={`${pilot}-${index}`}
              className="flex items-center gap-3 rounded-2xl border bg-slate-50 p-4 transition hover:bg-slate-100"
            >
              <div className="rounded-xl bg-cyan-100 p-2">
                <User className="h-4 w-4 text-cyan-600" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Pilot #{index + 1}</p>

                <h1 className="font-semibold text-slate-900">{pilot}</h1>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed p-6 text-center">
            <p className="text-sm text-slate-500">No pilot assigned</p>
          </div>
        )}
      </div>
    </div>
  );
}
