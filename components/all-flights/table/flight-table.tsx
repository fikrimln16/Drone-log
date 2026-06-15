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
    width: "120px",
  },
  {
    label: "AMA",
    key: "ama",
    width: "220px",
  },
  {
    label: "ESTATE",
    key: "estate",
    width: "180px",
  },
  {
    label: "FLIGHT ID",
    key: "flight_id",
    width: "180px",
  },
  {
    label: "MISSION",
    key: "mission_name",
    width: "260px",
  },
  {
    label: "PILOT",
    key: "pilots",
    width: "260px",
  },
  {
    label: "UAV UNIT",
    key: "uav_unit",
    width: "160px",
  },
  {
    label: "DURATION",
    key: "duration_min",
    width: "120px",
  },
  {
    label: "ACTION",
    key: "action",
    width: "140px",
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
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    width: column.width,
                    minWidth: column.width,
                  }}
                  className="p-5 text-center text-sm font-bold tracking-wide text-gray-700"
                >
                  {column.key === "action" ? (
                    column.label
                  ) : (
                    <div
                      onClick={() => onSort(column.key)}
                      className="flex cursor-pointer items-center justify-center gap-2"
                    >
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
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {flights.map((item) => (
              <FlightsRow
                key={item.id}
                item={item}
                // onDetail={onDetail}
                // onEdit={onEdit}
                // onDelete={onDelete}
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
