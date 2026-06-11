type Props = {
  item: any;

  onDetail: (item: any) => void;

  onEdit: (item: any) => void;

  onDelete: (item: any) => void;
};

export default function MissionRow({
  item,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b transition hover:bg-gray-50">
      {/* DATE */}
      <td className="p-6 text-lg">
        {new Date(item.flight_date).toLocaleDateString("id-ID")}
      </td>

      {/* FLIGHT */}
      <td className="p-6">
        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
          {item.flight_id}
        </span>
      </td>

      {/* AMA */}
      <td className="p-6">
        <span className="rounded-full bg-purple-100 px-4 py-1 text-sm text-purple-700">
          {item.ama}
        </span>
      </td>

      {/* ESTATE */}
      <td className="p-6">
        <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
          {item.estate}
        </span>
      </td>

      {/* PILOT */}
      <td className="p-6">
        <div className="flex flex-wrap gap-2">
          {item.pilots?.map((pilot: string) => (
            <span
              key={pilot}
              className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700"
            >
              {pilot}
            </span>
          ))}
        </div>
      </td>

      {/* DURATION */}
      <td className="p-6">
        <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
          {item.duration_min} min
        </span>
      </td>

      {/* NOTES */}
      <td className="max-w-[250px] p-6 text-lg">
        <p className="truncate">{item.notes}</p>
      </td>

      {/* ACTION */}
      <td className="space-x-2 p-6 text-right">
        <button
          onClick={() => onDetail(item)}
          className="rounded-2xl border bg-white px-5 py-2 text-sm transition hover:bg-gray-100"
        >
          Detail
        </button>

        <button
          onClick={() => onEdit(item)}
          className="rounded-2xl bg-blue-50 px-5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item)}
          className="rounded-2xl bg-red-50 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
