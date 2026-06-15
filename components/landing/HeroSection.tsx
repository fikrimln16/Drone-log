"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Plane, MapPinned, Users, ClipboardList } from "lucide-react";

export default function HeroSection() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/landing-stats");

      const data = await res.json();

      setStats(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.jpeg')",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center py-20">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <div className="mx-auto max-w-6xl text-center">
            {/* TITLE */}
            <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-4xl md:text-5xl xl:text-5xl">
              Aerial Survey
            </h1>

            <h2 className="mt-4 text-base font-semibold text-cyan-400 sm:text-xl md:text-2xl xl:text-3xl">
              Application Performance & Monitoring
            </h2>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-6 max-w-3xl px-2 text-base leading-relaxed text-slate-200 md:mt-8 md:text-xl">
              Centralized platform for monitoring drone operations, aerial
              surveys, mission activities, pilot performance, and AMA coverage
              across operational areas.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="w-full rounded-2xl bg-cyan-600 px-8 py-4 text-center font-semibold text-white shadow-lg transition hover:bg-cyan-700 sm:w-auto"
              >
                Open Dashboard
              </Link>

              <Link
                href="/ama"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
              >
                View AMA Map
              </Link>

              <button
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-center font-semibold text-white/50 backdrop-blur sm:w-auto"
              >
                Flight Gallery
              </button>
            </div>

            {/* STATS */}
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
              {/* FLIGHTS */}
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-center backdrop-blur md:rounded-[28px] md:p-6">
                <Plane className="mx-auto mb-3 h-6 w-6 text-cyan-300 md:h-7 md:w-7" />

                <h1 className="text-3xl font-black text-white md:text-5xl">
                  {stats?.total_flights ?? "-"}
                </h1>

                <p className="mt-2 text-xs font-medium text-slate-300 md:text-sm">
                  Total Flights
                </p>
              </div>

              {/* PILOTS */}
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-center backdrop-blur md:rounded-[28px] md:p-6">
                <Users className="mx-auto mb-3 h-6 w-6 text-cyan-300 md:h-7 md:w-7" />

                <h1 className="text-3xl font-black text-white md:text-5xl">
                  {stats?.total_pilots ?? "-"}
                </h1>

                <p className="mt-2 text-xs font-medium text-slate-300 md:text-sm">
                  Total Pilots
                </p>
              </div>

              {/* AMA */}
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-center backdrop-blur md:rounded-[28px] md:p-6">
                <MapPinned className="mx-auto mb-3 h-6 w-6 text-cyan-300 md:h-7 md:w-7" />

                <h1 className="text-3xl font-black text-white md:text-5xl">
                  {stats?.total_amas ?? "-"}
                </h1>

                <p className="mt-2 text-xs font-medium text-slate-300 md:text-sm">
                  AMA Coverage
                </p>
              </div>

              {/* MISSIONS */}
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-center backdrop-blur md:rounded-[28px] md:p-6">
                <ClipboardList className="mx-auto mb-3 h-6 w-6 text-cyan-300 md:h-7 md:w-7" />

                <h1 className="text-3xl font-black text-white md:text-5xl">
                  {stats?.total_missions ?? "-"}
                </h1>

                <p className="mt-2 text-xs font-medium text-slate-300 md:text-sm">
                  Total Missions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
