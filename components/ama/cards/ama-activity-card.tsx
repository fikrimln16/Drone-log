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
      className={`w-full rounded-[28px] border p-5 text-left transition-all duration-200 ${
        selected
          ? "border-blue-300 bg-blue-50 shadow-md"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="line-clamp-1 text-lg font-bold text-slate-900">
            {ama.ama_name}
          </h1>

          <p className="mt-1 text-xs text-slate-500">
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

        <span className="text-sm font-semibold text-blue-600">
          View Details →
        </span>
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
    <div className={`rounded-2xl border p-3 ${styles[color]}`}>
      <div className="flex items-center gap-2">
        {icon}

        <p className="text-[10px] font-bold tracking-wider uppercase">
          {title}
        </p>
      </div>

      <h1 className="mt-2 text-2xl font-bold">{value}</h1>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    {
      label: string;
      className: string;
      dot: string;
    }
  > = {
    SUCCESS: {
      label: "Completed",
      className: "bg-green-100 text-green-800 ring-1 ring-green-200",
      dot: "bg-green-500",
    },

    ONGOING: {
      label: "Ongoing",
      className: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
      dot: "bg-sky-500",
    },

    NEXT: {
      label: "Next",
      className: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
      dot: "bg-orange-500",
    },

    WAITING: {
      label: "Waiting",
      className: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
      dot: "bg-yellow-500",
    },
  };

  const current = config[status?.toUpperCase()] || config.WAITING;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold shadow-sm ${current.className}`}
    >
      <div className={`h-2.5 w-2.5 rounded-full ${current.dot}`} />

      {current.label}
    </div>
  );
}
