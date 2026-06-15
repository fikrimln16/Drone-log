"use client";

import { useEffect, useState } from "react";

import {
  Plane,
  Users,
  MapPinned,
  ClipboardList,
  Clock3,
  ShieldCheck,
} from "lucide-react";

export default function StatsSection() {
  const [stats, setStats] = useState<any>(null);

  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      title: "Total Flights",
      value: stats?.total_flights || 0,
      icon: Plane,
      color: "bg-cyan-100 text-cyan-600",
    },

    {
      title: "Active Pilots",
      value: stats?.total_pilots || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },

    {
      title: "AMA Coverage",
      value: stats?.total_amas || 0,
      icon: MapPinned,
      color: "bg-purple-100 text-purple-600",
    },

    {
      title: "Missions",
      value: stats?.total_missions || 0,
      icon: ClipboardList,
      color: "bg-green-100 text-green-600",
    },

    {
      title: "Flight Duration",
      value: `${stats?.total_duration || 0} min`,
      icon: Clock3,
      color: "bg-yellow-100 text-yellow-600",
    },

    {
      title: "Operational Pilots",
      value: stats?.active_pilots || 0,
      icon: ShieldCheck,
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <section className="bg-[#f5f7fb] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 md:text-5xl">
            Operational Statistics
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            Live operational statistics generated from drone flight activities
            and pilot monitoring.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-[32px] border bg-white p-8"
                >
                  <div className="h-5 w-24 rounded bg-slate-200" />

                  <div className="mt-5 h-12 w-32 rounded bg-slate-200" />
                </div>
              ))
            : cards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[32px] border bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
                          {item.title}
                        </p>

                        <h1 className="mt-4 text-5xl font-black text-slate-900">
                          {item.value}
                        </h1>
                      </div>

                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-3xl ${item.color}`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* INFO SECTION */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-[32px] border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Flight Monitoring
            </h2>

            <p className="mt-3 text-slate-500">
              Monitor every flight activity, battery usage, and operational
              performance in real time.
            </p>
          </div>

          <div className="rounded-[32px] border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Pilot Analytics
            </h2>

            <p className="mt-3 text-slate-500">
              Analyze pilot productivity, mission participation, and operational
              trends.
            </p>
          </div>

          <div className="rounded-[32px] border bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">AMA Monitoring</h2>

            <p className="mt-3 text-slate-500">
              Track deployment progress and operational coverage across all
              monitored areas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
