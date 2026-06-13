import Link from "next/link";

type Props = {
  item: any;
};

export default function FlightsRow({ item }: Props) {
  return (
    <tr className="border-b transition hover:bg-gray-50">
      {/* DATE */}
      <td className="p-5">
        {new Date(item.flight_date).toLocaleDateString("id-ID")}
      </td>

      {/* AMA */}
      <td className="p-5">
        <span className="rounded-full bg-purple-100 px-4 py-1 text-sm text-purple-700">
          {item.ama}
        </span>
      </td>

      {/* ESTATE */}
      <td className="p-5">
        <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
          {item.estate}
        </span>
      </td>

      {/* FLIGHT */}
      <td className="p-5">
        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
          {item.flight_id}
        </span>
      </td>

      {/* MISSION */}
      <td className="p-5 font-medium">{item.mission_name}</td>

      {/* PILOT */}
      {/* PILOT */}
      <td className="p-5">
        <div className="flex flex-wrap gap-2">
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

      {/* BATTERY */}
      <td className="p-5">{item.battery_id}</td>

      {/* DURATION */}
      <td className="p-5">
        <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
          {item.duration_min} min
        </span>
      </td>

      {/* ACTION */}
      <td className="p-5">
        <div className="flex justify-end">
          <Link
            href={`/flights/${item.flight_id}`}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
          >
            View Detail
          </Link>
        </div>
      </td>
    </tr>
  );
}
