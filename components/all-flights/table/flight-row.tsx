import Link from "next/link";

type Props = {
  item: any;
};

export default function FlightsRow({ item }: Props) {
  return (
    <tr className="border-b transition hover:bg-gray-50">
      {/* DATE */}
      <td className="p-5 text-center">
        <div className="inline-flex flex-col rounded-2xl bg-slate-50 px-4 py-2">
          <span className="font-semibold text-slate-800">
            {new Date(item.flight_date).toLocaleDateString("id-ID")}
          </span>

          <span className="text-[11px] text-slate-500">Flight Date</span>
        </div>
      </td>

      {/* AMA */}
      <td className="p-5 text-center">
        <div className="flex justify-center">
          <div className="max-w-[200px] rounded-2xl bg-purple-50 px-4 py-2">
            <p
              className="truncate font-semibold text-purple-700"
              title={item.ama}
            >
              {item.ama}
            </p>
          </div>
        </div>
      </td>

      {/* ESTATE */}
      <td className="p-5 text-center">
        <span
          className={`inline-flex rounded-full px-4 py-2 text-xs font-bold ${
            !item.estate || item.estate === "-"
              ? "bg-slate-100 text-slate-500"
              : "bg-green-100 text-green-700"
          }`}
        >
          {!item.estate || item.estate === "-"
            ? "No Estate Selected"
            : item.estate}
        </span>
      </td>

      {/* FLIGHT */}
      <td className="p-5 text-center">
        <div className="inline-flex rounded-2xl bg-blue-50 px-4 py-2">
          <span className="font-bold text-blue-700">{item.flight_id}</span>
        </div>
      </td>

      {/* MISSION */}
      <td className="p-5 text-center">
        <div className="flex justify-center">
          <div className="max-w-[260px] rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
            <p
              className="truncate text-sm font-bold text-cyan-700"
              title={item.mission_name}
            >
              {item.mission_name}
            </p>
          </div>
        </div>
      </td>

      {/* PILOT */}
      <td className="p-5">
        <div className="flex flex-wrap justify-center gap-2">
          {(item.pilots || []).map((pilot: string) => (
            <span
              key={pilot}
              className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700"
            >
              {pilot}
            </span>
          ))}
        </div>
      </td>

      {/* UAV_UNIT */}
      <td className="p-5 text-center">
        <div className="inline-flex rounded-2xl bg-orange-50 px-4 py-2">
          <span className="font-semibold text-orange-700">
            ✈ {item.uav_unit}
          </span>
        </div>
      </td>

      {/* DURATION */}
      <td className="p-5 text-center">
        <div className="inline-flex flex-col rounded-2xl bg-yellow-50 px-4 py-2">
          <span className="font-bold text-yellow-700">{item.duration_min}</span>

          <span className="text-[11px] text-yellow-600">Minutes</span>
        </div>
      </td>

      {/* ACTION */}
      <td className="p-5 text-center">
        <Link
          href={`/flights/${item.flight_id}`}
          className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
        >
          View Detail
        </Link>
      </td>
    </tr>
  );
}
