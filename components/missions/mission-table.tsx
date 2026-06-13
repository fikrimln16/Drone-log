"use client";

import MissionRow from "./mission-row";

import MissionSortHeader from "./mission-sort-header";

type Props = {
  flights: any[];

  sortBy: string;

  sortDirection: "asc" | "desc";

  onSort: (key: any) => void;

  onDetail: (item: any) => void;

  onEdit: (item: any) => void;

  onDelete: (item: any) => void;
};

export default function MissionTable({
  flights,
  sortBy,
  sortDirection,
  onSort,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="mt-6 overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] table-fixed">
          {/* HEAD */}
          <thead className="border-b bg-gray-50">
            <tr>
              <MissionSortHeader
                label="DATE"
                field="flight_date"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="FLIGHT ID"
                field="flight_id"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="AMA"
                field="ama"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="ESTATE"
                field="estate"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="PILOT"
                field="pilot"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="DURATION"
                field="duration_min"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="NOTES"
                field="notes"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <th className="w-[160px] px-6 py-5 text-center text-sm font-bold">
                ACTION
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {flights.map((item) => (
              <MissionRow
                key={item.id}
                item={item}
                onDetail={onDetail}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
