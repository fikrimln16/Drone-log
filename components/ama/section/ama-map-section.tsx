"use client";

import AmaMonitorMap from "@/components/ama/ama-monitoring-map";

type Props = {
  amas: any[];

  onSelectAma: (ama: any) => void;
};

export default function AmaMapSection({ amas, onSelectAma }: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-7 py-6">
        <div>
          <h1 className="text-3xl font-bold">AMA Drone Monitoring</h1>

          <p className="mt-1 text-sm text-gray-500">
            Real-time Indonesia drone operation map
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
          • Live Monitor
        </div>
      </div>

      {/* MAP */}
      <div className="h-[520px]">
        <AmaMonitorMap amas={amas} onSelectAma={onSelectAma} />
      </div>
    </div>
  );
}
