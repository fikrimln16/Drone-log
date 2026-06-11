"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import FlightsRow from "./flight-row";

type Props = {
  flights: any[];

  sortBy: string;

  sortDirection: string;

  onSort: (key: any) => void;

  onDetail: (item: any) => void;

  onEdit: (item: any) => void;

  onDelete: (item: any) => void;
};

const columns = [
  {
    label: "DATE",
    key: "flight_date",
    width: "140px",
  },
  {
    label: "AMA",
    key: "ama",
    width: "180px",
  },
  {
    label: "ESTATE",
    key: "estate",
    width: "120px",
  },
  {
    label: "FLIGHT ID",
    key: "flight_id",
    width: "180px",
  },
  {
    label: "MISSION",
    key: "mission_name",
    width: "320px",
  },
  {
    label: "PILOT",
    key: "pilots",
    width: "220px",
  },
  {
    label: "BATTERY",
    key: "battery_id",
    width: "140px",
  },
  {
    label: "DURATION",
    key: "duration_min",
    width: "120px",
  },
];

export default function FlightsTable({
  flights,
  sortBy,
  sortDirection,
  onSort,

  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1400px] table-fixed border-separate border-spacing-0">
          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    width: column.width,
                    minWidth: column.width,
                  }}
                  onClick={() => onSort(column.key)}
                  className="cursor-pointer p-5 text-left text-sm font-bold tracking-wide text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    {column.label}

                    {sortBy === column.key ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-blue-600" />
                      )
                    ) : (
                      <ArrowDown className="h-4 w-4 text-gray-300" />
                    )}
                  </div>
                </th>
              ))}

              <th className="p-5 text-right text-sm font-bold tracking-wide text-gray-700">
                ACTION
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {flights.map((item) => (
              <FlightsRow
                key={item.id}
                item={item}
                onDetail={onDetail}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}

            {/* EMPTY */}
            {flights.length === 0 && (
              <tr>
                <td colSpan={9} className="p-10 text-center text-gray-500">
                  No flights found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
