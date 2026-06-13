"use client";

import dynamic from "next/dynamic";

import { MapPinned } from "lucide-react";

const FlightMapLeaflet = dynamic(() => import("./flight-map-leaflet"), {
  ssr: false,
});

type Props = {
  data: any;
};

function getStatusStyle(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
      return "bg-green-100 text-green-700 ring-green-200";

    case "ONGOING":
      return "bg-sky-100 text-sky-700 ring-sky-200";

    case "NEXT":
      return "bg-orange-100 text-orange-700 ring-orange-200";

    case "WAITING":
      return "bg-yellow-100 text-yellow-700 ring-yellow-200";

    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

export default function FlightMapCard({ data }: Props) {
  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flight Location</h1>

          <p className="mt-1 text-sm text-slate-500">
            AMA coordinate monitoring
          </p>
        </div>

        <div className="rounded-2xl bg-blue-100 p-3">
          <MapPinned className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* INFO BAR */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-500">AMA</p>

          <h1 className="font-bold">{data.ama_name}</h1>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-bold ring-1 ${getStatusStyle(
            data.status
          )}`}
        >
          {data.status}
        </div>
      </div>

      {/* MAP */}
      <div className="overflow-hidden rounded-2xl border">
        <FlightMapLeaflet data={data} />
      </div>

      {/* COORDINATES */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Latitude</p>

          <h1 className="mt-1 font-bold">{Number(data.latitude).toFixed(6)}</h1>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Longitude</p>

          <h1 className="mt-1 font-bold">
            {Number(data.longitude).toFixed(6)}
          </h1>
        </div>
      </div>
    </div>
  );
}
