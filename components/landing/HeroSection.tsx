"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { Plane, MapPinned, Users } from "lucide-react";

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
    <section className="relative h-screen overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/background.jpeg')",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-6xl text-center">
            {/* BADGE */}
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200 backdrop-blur">
              <Plane className="h-4 w-4" />
              Drone Monitoring Platform
            </div>

            {/* TITLE */}
            <h1 className="mt-8 text-5xl font-black tracking-tight text-white md:text-7xl xl:text-8xl">
              Aerial Survey
            </h1>

            <h2 className="mt-4 text-2xl font-bold text-cyan-400 md:text-4xl xl:text-5xl">
              Application Performance & Monitoring Platform
            </h2>

            {/* DESCRIPTION */}
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl">
              Centralized platform for monitoring drone operations, aerial
              surveys, mission activities, pilot performance, and AMA coverage
              across operational areas.
            </p>

            {/* BUTTONS */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="rounded-2xl bg-cyan-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-cyan-700"
              >
                Open Dashboard
              </Link>

              <Link
                href="/ama"
                className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                View AMA Map
              </Link>

              <button
                disabled
                className="cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white/50 backdrop-blur"
              >
                Flight Gallery
              </button>
            </div>

            {/* STATS */}
            {/* STATS */}
            <div className="mt-16 grid max-w-5xl grid-cols-2 gap-5 lg:grid-cols-4">
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-center backdrop-blur">
                <Plane className="mx-auto mb-4 h-7 w-7 text-cyan-300" />

                <h1 className="text-5xl font-black text-white">
                  {stats?.total_flights ?? "-"}
                </h1>

                <p className="mt-2 text-sm font-medium text-slate-300">
                  Total Flights
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-center backdrop-blur">
                <Plane className="mx-auto mb-4 h-7 w-7 text-cyan-300" />

                <h1 className="text-5xl font-black text-white">
                  {stats?.total_pilots ?? "-"}
                </h1>

                <p className="mt-2 text-sm font-medium text-slate-300">
                  Total Pilots
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-center backdrop-blur">
                <Plane className="mx-auto mb-4 h-7 w-7 text-cyan-300" />

                <h1 className="text-5xl font-black text-white">
                  {stats?.total_amas ?? "-"}
                </h1>

                <p className="mt-2 text-sm font-medium text-slate-300">
                  Ama Coverage
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-center backdrop-blur">
                <Plane className="mx-auto mb-4 h-7 w-7 text-cyan-300" />

                <h1 className="text-5xl font-black text-white">
                  {stats?.total_missions ?? "-"}
                </h1>

                <p className="mt-2 text-sm font-medium text-slate-300">
                  Missions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs tracking-widest uppercase">Scroll</span>

          <div className="mt-2 h-10 w-[2px] bg-white/40" />
        </div>
      </div>
    </section>
  );
}
