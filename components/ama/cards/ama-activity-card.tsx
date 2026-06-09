"use client";

import { Calendar, MapPin, Plane, Radio } from "lucide-react";

type Props = {
  ama: any;

  selected?: boolean;

  onClick?: () => void;
};

export default function AmaActivityCard({ ama, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[28px] border p-5 text-left transition ${
        selected ? "border-blue-300 bg-blue-50" : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="line-clamp-1 text-xl font-bold">{ama.ama_name}</h1>

          <p className="mt-1 text-sm text-gray-500">
            {Number(ama.latitude).toFixed(4)},{" "}
            {Number(ama.longitude).toFixed(4)}
          </p>
        </div>

        <StatusBadge status={ama.status} />
      </div>

      {/* STATS */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <SmallCard
          icon={<Plane className="h-4 w-4" />}
          title="Flights"
          value={ama.total_flights}
          color="blue"
        />

        <SmallCard
          icon={<Radio className="h-4 w-4" />}
          title="Missions"
          value={ama.total_missions}
          color="purple"
        />
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Indonesia
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />

            {ama.last_flight
              ? new Date(ama.last_flight).toLocaleDateString()
              : "-"}
          </div>
        </div>

        <span className="text-sm font-semibold text-blue-600">View Detail</span>
      </div>
    </button>
  );
}

function SmallCard({ icon, title, value, color }: any) {
  const styles: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",

    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className={`rounded-2xl border p-4 ${styles[color]}`}>
      <div className="flex items-center gap-2">
        {icon}

        <p className="text-xs font-bold tracking-widest uppercase">{title}</p>
      </div>

      <h1 className="mt-3 text-3xl font-bold">{value}</h1>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    SUCCESS: "bg-green-100 text-green-700",

    ONGOING: "bg-yellow-100 text-yellow-700",

    PENDING: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
