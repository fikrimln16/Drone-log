"use client";

type Flight = {
  id: number;

  flight_id: string;

  mission_name: string;

  pilot: string;

  estate: string;

  duration_min: number;

  start_time: string;

  battery_id: string;
};

type Props = {
  flights: Flight[];
};

export default function AmaFlightTable({ flights }: Props) {
  return (
    <div className="overflow-hidden rounded-[28px] border bg-white">
      {/* HEADER */}
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-bold">Flight & Mission Activity</h1>

        <p className="mt-1 text-sm text-gray-500">
          Latest operational flight history
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Flight ID
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Mission
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Pilot
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Estate
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Battery
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Duration
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold tracking-widest text-gray-500 uppercase">
                Start Time
              </th>
            </tr>
          </thead>

          <tbody>
            {flights.map((flight) => (
              <tr
                key={flight.id}
                className="border-t transition hover:bg-gray-50"
              >
                <td className="px-6 py-5">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {flight.flight_id}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {flight.mission_name}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm font-medium">
                  {flight.pilot || "-"}
                </td>

                <td className="px-6 py-5 text-sm">{flight.estate || "-"}</td>

                <td className="px-6 py-5">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {flight.battery_id}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm font-semibold">
                  {flight.duration_min} min
                </td>

                <td className="px-6 py-5 text-sm">{flight.start_time}</td>
              </tr>
            ))}

            {flights.length === 0 && (
              <tr>
                <td colSpan={7} className="py-20 text-center text-gray-400">
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
