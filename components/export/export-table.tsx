type Props = {
  flights: any[];

  onDetail: (item: any) => void;
};

export default function ExportTable({ flights, onDetail }: Props) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full min-w-[1500px] table-fixed">
        <thead className="sticky top-0 border-b bg-white">
          <tr>
            {[
              "DATE",
              "AMA",
              "ESTATE",
              "PILOT",
              "FLIGHT ID",
              "MISSION",
              "BATTERY",
              "DURATION",
              "ACTION",
            ].map((item) => (
              <th key={item} className="p-5 text-left text-sm font-bold">
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {flights.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="p-5">
                {new Date(item.flight_date).toLocaleDateString("id-ID")}
              </td>

              <td className="p-5">{item.ama}</td>

              <td className="p-5">{item.estate}</td>

              <td className="p-5">
                <div className="flex flex-wrap gap-1">
                  {(item.pilots || []).map((pilot: string) => (
                    <span
                      key={pilot}
                      className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700"
                    >
                      {pilot}
                    </span>
                  ))}
                </div>
              </td>

              <td className="p-5">{item.flight_id}</td>

              <td className="p-5">{item.mission_name}</td>

              <td className="p-5">{item.battery_id}</td>

              <td className="p-5">{item.duration_min} min</td>

              <td className="p-5">
                <button
                  onClick={() => onDetail(item)}
                  className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
