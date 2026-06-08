"use client";

import { useMemo, useState } from "react";

import PilotAnalyticsModal from "./pilot-analytics-modal";

import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";

type Props = {
  pilots: any[];

  loading: boolean;
};

type SortKey =
  | "pilot"
  | "total_duration"
  | "total_flights"
  | "total_missions"
  | "last_flight";

export default function PilotTable({
  pilots,
  loading,
}: Props) {
  // SORT
  const [sortBy, setSortBy] =
    useState<SortKey>(
      "total_duration"
    );

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">(
      "desc"
    );

  // HANDLE SORT
  function handleSort(
    key: SortKey
  ) {
    if (sortBy === key) {
      setSortDirection((prev) =>
        prev === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortBy(key);

      setSortDirection("desc");
    }
  }

  // SORTED DATA
  const sortedPilots = useMemo(() => {
    return [...pilots].sort(
      (a, b) => {
        const valueA =
          a[sortBy];

        const valueB =
          b[sortBy];

        // NUMBER
        if (
          typeof valueA ===
            "number" ||
          !isNaN(valueA)
        ) {
          return sortDirection ===
            "asc"
            ? Number(valueA) -
                Number(valueB)
            : Number(valueB) -
                Number(valueA);
        }

        // DATE
        if (
          sortBy ===
          "last_flight"
        ) {
          return sortDirection ===
            "asc"
            ? new Date(
                valueA
              ).getTime() -
                new Date(
                  valueB
                ).getTime()
            : new Date(
                valueB
              ).getTime() -
                new Date(
                  valueA
                ).getTime();
        }

        // STRING
        return sortDirection ===
          "asc"
          ? String(
              valueA
            ).localeCompare(
              String(valueB)
            )
          : String(
              valueB
            ).localeCompare(
              String(valueA)
            );
      }
    );
  }, [
    pilots,
    sortBy,
    sortDirection,
  ]);

  // STATUS
  function getStatus(
    duration: number
  ) {
    if (duration >= 600) {
      return {
        label: "High Load",

        className:
          "bg-red-100 text-red-700",
      };
    }

    if (duration >= 300) {
      return {
        label: "Medium",

        className:
          "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      label: "Safe",

      className:
        "bg-green-100 text-green-700",
    };
  }

  // SORT ICON
  function SortIcon({
    column,
  }: {
    column: SortKey;
  }) {
    if (sortBy !== column) {
      return (
        <ArrowDown className="h-4 w-4 text-gray-300" />
      );
    }

    return sortDirection ===
      "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  }

  const [selectedPilot, setSelectedPilot] =
  useState<any>(null);

   const [analytics, setAnalytics] =
   useState<any>(null);

   const [loadingAnalytics, setLoadingAnalytics] =
   useState(false);

   async function handleViewAnalytics(
   pilot: string
   ) {
   try {
      setLoadingAnalytics(true);

      setSelectedPilot(pilot);

      const res = await fetch(
         `/api/pilots/${pilot}`
      );

      const data =
         await res.json();

      setAnalytics(data);
   } catch (error) {
      console.error(error);
   } finally {
      setLoadingAnalytics(false);
   }
   }

  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          {/* HEAD */}
          <thead className="border-b bg-gray-50">
            <tr>
              <th
                onClick={() =>
                  handleSort("pilot")
                }
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  PILOT
                  <SortIcon column="pilot" />
                </div>
              </th>

              <th
                onClick={() =>
                  handleSort(
                    "total_duration"
                  )
                }
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  TOTAL DURATION
                  <SortIcon column="total_duration" />
                </div>
              </th>

              <th
                onClick={() =>
                  handleSort(
                    "total_flights"
                  )
                }
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  FLIGHTS
                  <SortIcon column="total_flights" />
                </div>
              </th>

              <th
                onClick={() =>
                  handleSort(
                    "total_missions"
                  )
                }
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  MISSIONS
                  <SortIcon column="total_missions" />
                </div>
              </th>

              <th
                onClick={() =>
                  handleSort(
                    "last_flight"
                  )
                }
                className="cursor-pointer px-6 py-5 text-left text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  LAST FLIGHT
                  <SortIcon column="last_flight" />
                </div>
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold">
                STATUS
              </th>

              <th className="px-6 py-5 text-right text-sm font-bold">
                ACTION
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              sortedPilots.map(
                (pilot) => {
                  const status =
                    getStatus(
                      Number(
                        pilot.total_duration
                      )
                    );

                  return (
                    <tr
                      key={
                        pilot.pilot
                      }
                      className="border-b transition hover:bg-gray-50"
                    >
                      {/* PILOT */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 font-bold text-cyan-700">
                            {pilot.pilot?.charAt(
                              0
                            )}
                          </div>

                          <div>
                            <p className="font-bold">
                              {
                                pilot.pilot
                              }
                            </p>

                            <p className="text-sm text-gray-500">
                              Drone Pilot
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DURATION */}
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-semibold text-yellow-700">
                          {
                            pilot.total_duration
                          }{" "}
                          min
                        </span>
                      </td>

                      {/* FLIGHTS */}
                      <td className="px-6 py-5">
                        {
                          pilot.total_flights
                        }
                      </td>

                      {/* MISSIONS */}
                      <td className="px-6 py-5">
                        {
                          pilot.total_missions
                        }
                      </td>

                      {/* LAST */}
                      <td className="px-6 py-5">
                        {new Date(
                          pilot.last_flight
                        ).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-4 py-1 text-sm font-semibold ${status.className}`}
                        >
                          {
                            status.label
                          }
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-5 text-right">
                        <button
                           onClick={() =>
                              handleViewAnalytics(
                                 pilot.pilot
                              )
                           }
                           className="rounded-2xl border bg-white px-5 py-2 text-sm transition hover:bg-gray-100"
                           >
                           View Analytics
                           </button>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>
      <PilotAnalyticsModal
         open={!!selectedPilot}
         data={analytics}
         loading={loadingAnalytics}
         onClose={() => {
            setSelectedPilot(null);

            setAnalytics(null);
         }}
         />
    </div>
  );
}