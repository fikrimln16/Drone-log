"use client";

import { Clock3 } from "lucide-react";

type Props = {
  data: any;
};

export default function FlightTimelineCard({ data }: Props) {
  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-orange-100 p-3">
          <Clock3 className="h-5 w-5 text-orange-600" />
        </div>

        <div>
          <h1 className="text-xl font-bold">Flight Timeline</h1>

          <p className="text-sm text-slate-500">Operation duration</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between">
          <span className="font-semibold">{data.start_time}</span>

          <span className="font-semibold">{data.end_time}</span>
        </div>

        <div className="mt-3 h-2 rounded-full bg-slate-200">
          <div className="h-full w-full rounded-full bg-blue-500" />
        </div>

        <p className="mt-3 text-center text-sm text-slate-500">
          Total Duration
        </p>

        <h1 className="text-center text-3xl font-black">
          {data.duration_min} Min
        </h1>
      </div>
    </div>
  );
}
