"use client";

type Flight = {
  id: number;

  flight_id: string;

  flight_date: string;

  mission_name: string;

  estate: string;

  uav_unit: string;

  duration_min: number;

  battery_id: string;

  end_percent: number;

  pilots: string[];
};

type Props = {
  flights: Flight[];
};

export default function AmaFlightTable({ flights }: Props) {
  return (
    <div className="overflow-hidden rounded-[28px] border bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-bold">Flight Activity</h1>

        <p className="mt-1 text-sm text-gray-500">
          Latest operational flight history
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px] table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[140px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Flight ID
              </th>

              <th className="w-[280px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Mission
              </th>

              <th className="w-[120px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Estate
              </th>

              <th className="w-[220px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Pilot
              </th>

              <th className="w-[120px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                UAV
              </th>

              <th className="w-[120px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Duration
              </th>

              <th className="w-[140px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Battery
              </th>

              <th className="w-[140px] px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {flights.map((flight) => (
              <tr
                key={flight.id}
                className="border-t transition hover:bg-gray-50"
              >
                {/* FLIGHT ID */}
                <td className="px-6 py-5">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {flight.flight_id}
                  </span>
                </td>

                {/* MISSION */}
                <td className="px-6 py-5">
                  <div
                    className="max-w-[250px] truncate"
                    title={flight.mission_name}
                  >
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {flight.mission_name}
                    </span>
                  </div>
                </td>

                {/* ESTATE */}
                <td className="px-6 py-5 text-sm font-medium">
                  {flight.estate}
                </td>

                {/* PILOTS */}
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    {(flight.pilots || []).map((pilot) => (
                      <span
                        key={pilot}
                        className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700"
                      >
                        {pilot}
                      </span>
                    ))}
                  </div>
                </td>

                {/* UAV */}
                <td className="px-6 py-5">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {flight.uav_unit}
                  </span>
                </td>

                {/* DURATION */}
                <td className="px-6 py-5">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {flight.duration_min} min
                  </span>
                </td>

                {/* BATTERY */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {flight.battery_id}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                        flight.end_percent <= 25
                          ? "bg-red-100 text-red-700"
                          : flight.end_percent <= 40
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {flight.end_percent}%
                    </span>
                  </div>
                </td>

                {/* DATE */}
                <td className="px-6 py-5 text-sm text-gray-600">
                  {new Date(flight.flight_date).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}

            {flights.length === 0 && (
              <tr>
                <td colSpan={8} className="py-20 text-center text-gray-400">
                  No flight activity found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
