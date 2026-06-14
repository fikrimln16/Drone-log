"use client";

import AmaMonitorMap from "@/components/ama/ama-monitoring-map";

export default function AmaMapSection({ amas, onSelectAma }: any) {
  return (
    <div className="overflow-hidden rounded-[28px] border bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h1 className="text-3xl font-bold">AMA Drone Monitoring</h1>

          <p className="mt-1 text-sm text-gray-500">
            Real-time Indonesia drone operation map
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          • Live Monitor
        </div>
      </div>

      {/* MAP */}
      <div className="h-[620px]">
        <AmaMonitorMap amas={amas} onSelectAma={onSelectAma} />
      </div>
    </div>
  );
}
