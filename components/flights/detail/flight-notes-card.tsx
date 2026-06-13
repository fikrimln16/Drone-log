"use client";

import { FileText } from "lucide-react";

type Props = {
  data: any;
};

export default function FlightNotesCard({ data }: Props) {
  return (
    <div className="mt-5 rounded-[28px] border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-yellow-100 p-3">
          <FileText className="h-5 w-5 text-yellow-600" />
        </div>

        <div>
          <h1 className="text-xl font-bold">Flight Notes</h1>

          <p className="text-sm text-slate-500">Additional information</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
        {data.notes ? (
          <p>{data.notes}</p>
        ) : (
          <p className="text-slate-400">No additional notes available</p>
        )}
      </div>
    </div>
  );
}
