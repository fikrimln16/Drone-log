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
  return (
    <div className="flex h-[950px] flex-col overflow-hidden rounded-[32px] border bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-purple-100 p-3">
            <Radio className="h-5 w-5 text-purple-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">AMA Activity</h1>

            <p className="text-sm text-gray-500">Active operational area</p>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["ALL", "SUCCESS", "ONGOING", "PENDING"].map((item) => (
          <button
            key={item}
            onClick={() => setStatusFilter(item)}
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
              statusFilter === item
                ? item === "SUCCESS"
                  ? "bg-green-500 text-white"
                  : item === "ONGOING"
                    ? "bg-yellow-500 text-white"
                    : item === "PENDING"
                      ? "bg-red-500 text-white"
                      : "bg-black text-white"
                : "border bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {amas.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-[28px] border border-dashed">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-600">No AMA Found</h1>

              <p className="mt-2 text-sm text-gray-500">
                No operational area available
              </p>
            </div>
          </div>
        ) : (
          amas.map((ama) => (
            <AmaActivityCard
              key={ama.id}
              ama={ama}
              selected={selectedAma?.id === ama.id}
              onClick={() => setSelectedAma(ama)}
            />
          ))
        )}
      </div>
    </div>
  );
}
