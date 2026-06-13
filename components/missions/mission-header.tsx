import Link from "next/link";

import { ArrowLeft, Download, Plus } from "lucide-react";

type Props = {
  mission: string;

  ama: string;

  amaStatus: string;

  totalFlights: number;

  totalPilots: number;

  totalDuration: number;

  onOpenExport: () => void;

  onAdd: () => void;
};

export default function MissionHeader({
  mission,
  totalFlights,
  ama,
  amaStatus,
  totalDuration,
  totalPilots,
  onOpenExport,
  onAdd,
}: Props) {
  return (
    <div className="mb-8">
      {/* BACK */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:border-blue-500 hover:bg-blue-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{mission}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
            {ama}
          </span>

          <span
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              amaStatus === "SUCCESS"
                ? "bg-green-100 text-green-700"
                : amaStatus === "ONGOING"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            ● {amaStatus}
          </span>
        </div>
        <p className="mt-3 text-lg text-gray-500">
          {totalFlights} flights logged with {totalPilots} pilots.
        </p>
      </div>
    </div>
  );
}
