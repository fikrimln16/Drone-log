"use client";

import { Radio } from "lucide-react";

import AmaActivityCard from "./cards/ama-activity-card";

type Props = {
  amas: any[];

  selectedAma: any;

  setSelectedAma: (ama: any) => void;

  statusFilter: string;

  setStatusFilter: (value: string) => void;
};

export default function AmaActivitySidebar({
  amas,
  selectedAma,
  setSelectedAma,
  statusFilter,
  setStatusFilter,
}: Props) {
  const statusOptions = [
    {
      value: "ALL",
      label: "All",
    },
    {
      value: "SUCCESS",
      label: "Completed",
      bg: "bg-green-500",
      active: "bg-green-100 text-green-800 ring-1 ring-green-200",
    },
    {
      value: "ONGOING",
      label: "Ongoing",
      bg: "bg-yellow-500",
      active: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
    },
    {
      value: "WAITING",
      label: "Waiting",
      bg: "bg-orange-500",
      active: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
    },
  ];

  return (
    <div className="flex h-full min-h-[850px] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100">
          <Radio className="h-5 w-5 text-purple-600" />
        </div>

        <div>
          <h1 className="text-[20px] font-bold text-slate-900">AMA Activity</h1>

          <p className="text-sm text-slate-500">Active operational area</p>
        </div>
      </div>

      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}

      <div className="mb-5 flex flex-wrap gap-2">
        {statusOptions.map((item) => (
          <button
            key={item.value}
            onClick={() => setStatusFilter(item.value)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              statusFilter === item.value
                ? item.value === "ALL"
                  ? "bg-slate-900 text-white shadow-md"
                  : item.active
                : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            } `}
          >
            {item.value !== "ALL" && (
              <div className={`h-2.5 w-2.5 rounded-full ${item.bg}`} />
            )}

            {item.label}
          </button>
        ))}
      </div>

      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      <div className="flex-1 overflow-y-auto pr-1">
        {amas.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-[24px] border border-dashed border-slate-300">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Radio className="h-7 w-7 text-slate-400" />
              </div>

              <h2 className="text-lg font-bold text-slate-700">No AMA Found</h2>

              <p className="mt-2 text-sm text-slate-500">
                No operational area available
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {amas.map((ama) => (
              <AmaActivityCard
                key={ama.id}
                ama={ama}
                selected={selectedAma?.id === ama.id}
                onClick={() => setSelectedAma(ama)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
