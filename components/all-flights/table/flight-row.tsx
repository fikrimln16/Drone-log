type Props = {
  item: any;

  onDetail: (item: any) => void;

  onEdit: (item: any) => void;

  onDelete: (item: any) => void;
};

export default function FlightsRow({
  item,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
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
        <div className="flex justify-end gap-2">
          {/* DETAIL */}
          <button
            type="button"
            onClick={() => onDetail(item)}
            className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100"
          >
            Detail
          </button>

          {/* EDIT */}
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-xl bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
          >
            Edit
          </button>

          {/* DELETE */}
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
