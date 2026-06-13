"use client";

import MissionRow from "./mission-row";
import MissionSortHeader from "./mission-sort-header";

type Props = {
  flights: any[];

  sortBy: string;

  sortDirection: "asc" | "desc";

  onSort: (key: any) => void;

  onDetail: (item: any) => void;
};

export default function MissionTable({
  flights,
  sortBy,
  sortDirection,
  onSort,
  onDetail,
}: Props) {
  return (
    <div className="mt-6 overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] table-fixed">
          <thead className="border-b bg-gray-50">
            <tr>
              <MissionSortHeader
                label="DATE"
                field="flight_date"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
                width="140px"
              />

              <MissionSortHeader
                label="FLIGHT ID"
                field="flight_id"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
                width="180px"
              />

              <MissionSortHeader
                label="ESTATE"
                field="estate"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
                width="180px"
              />

              <MissionSortHeader
                label="PILOT"
                field="pilots"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
                width="320px"
              />

              <MissionSortHeader
                label="UAV"
                field="uav_unit"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
                width="140px"
              />

              <MissionSortHeader
                label="battery_usage"
                field="battery_usage"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
                width="160px"
              />

              <MissionSortHeader
                label="DURATION"
                field="duration_min"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
                width="140px"
              />

              <th className="w-[160px] px-6 py-5 text-center text-sm font-bold">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {flights.map((item) => (
              <MissionRow key={item.id} item={item} onDetail={onDetail} />
            ))}

            {flights.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No flight data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
