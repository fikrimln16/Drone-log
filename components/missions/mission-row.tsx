"use client";

import { Eye } from "lucide-react";

import Link from "next/link";

type Props = {
  item: any;

  onDetail: (item: any) => void;
};

export default function MissionRow({ item, onDetail }: Props) {
  const batteryUsed =
    Number(item.start_percent || 0) - Number(item.end_percent || 0);

  return (
    <tr className="border-b transition hover:bg-slate-50">
      {/* DATE */}
      <td className="px-6 py-5 text-sm font-medium whitespace-nowrap">
        {new Date(item.flight_date).toLocaleDateString("id-ID")}
      </td>

      {/* FLIGHT ID */}
      <td className="px-6 py-5">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {item.flight_id}
        </span>
      </td>

      {/* ESTATE */}
      <td className="px-6 py-5">
        {item.estate && item.estate !== "-" && item.estate.trim() !== "" ? (
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold whitespace-nowrap text-green-700">
            {item.estate}
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold whitespace-nowrap text-slate-600">
            No Estate Selected
          </span>
        )}
      </td>

      {/* PILOT */}
      <td className="px-6 py-5">
        <div className="flex flex-wrap gap-2">
          {(item.pilots || []).slice(0, 3).map((pilot: string) => (
            <span
              key={pilot}
              className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700"
            >
              {pilot}
            </span>
          ))}

          {(item.pilots || []).length > 3 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              +{item.pilots.length - 3}
            </span>
          )}
        </div>
      </td>

      {/* UAV */}
      <td className="px-6 py-5">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
          {item.uav_unit || "-"}
        </span>
      </td>

      {/* BATTERY */}
      <td className="px-6 py-5">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
          {batteryUsed}%
        </span>
      </td>

      {/* DURATION */}
      <td className="px-6 py-5">
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
          {item.duration_min} min
        </span>
      </td>

      {/* ACTION */}
      <td className="px-6 py-5 text-center">
        <Link
          href={`/flights/${item.flight_id}`}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition hover:bg-slate-100"
        >
          <Eye className="h-4 w-4" />
          Detail
        </Link>
      </td>
    </tr>
  );
}
