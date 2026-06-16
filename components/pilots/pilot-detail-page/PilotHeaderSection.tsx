"use client";

import Image from "next/image";
import Link from "next/link";

import PilotStatsCards from "./PilotStatsCard";

import { ArrowLeft, CalendarDays, User } from "lucide-react";

type Props = {
  summary: any;
};

export default function PilotHeaderSection({ summary }: Props) {
  return (
    <div className="mb-6">
      {/* BACK BUTTON */}
      <Link
        href="/pilots"
        className="mb-6 inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:border-cyan-500 hover:bg-cyan-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pilot Management
      </Link>

      {/* HEADER CARD */}
      <div className="rounded-[32px] border bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
          {/* ===================================================== */}
          {/* LEFT PROFILE */}
          {/* ===================================================== */}

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* PHOTO */}
            <div className="flex-shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded-[28px] border-2 border-cyan-100 bg-white shadow-sm">
                {summary.photo_url ? (
                  <Image
                    src={summary.photo_url}
                    alt={summary.pilot}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-cyan-100 text-4xl font-black text-cyan-700">
                    {summary.pilot?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              {/* NAME */}
              <h1
                className="text-3xl leading-[1.05] font-black text-slate-900 md:text-4xl"
                title={summary.pilot}
              >
                {summary.pilot}
              </h1>

              {/* STATUS */}
              <div className="mt-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  ACTIVE PILOT
                </div>
              </div>

              {/* INFO */}
              <div className="mt-4 flex flex-wrap gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    <User className="h-4 w-4" />
                    Pilot ID
                  </div>

                  <h1 className="mt-1 font-bold text-slate-900">
                    PLT-{String(summary.id).padStart(3, "0")}
                  </h1>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                    <CalendarDays className="h-4 w-4" />
                    Last Activity
                  </div>

                  <h1 className="mt-1 font-bold text-slate-900">
                    {summary.last_flight
                      ? new Date(summary.last_flight).toLocaleDateString(
                          "id-ID"
                        )
                      : "No Activity"}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT STATS */}
          {/* ===================================================== */}

          <div className="flex items-center">
            <PilotStatsCards summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
