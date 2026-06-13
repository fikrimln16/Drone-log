"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  label: string;

  field: string;

  sortBy: string;

  sortDirection: "asc" | "desc";

  onSort: (key: string) => void;

  width?: string;
};

export default function MissionSortHeader({
  label,
  field,
  sortBy,
  sortDirection,
  onSort,
  width,
}: Props) {
  const active = sortBy === field;

  return (
    <th
      style={{
        width,
        minWidth: width,
      }}
      className="px-6 py-5 text-left"
    >
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-2 text-sm font-bold tracking-wide whitespace-nowrap"
      >
        {label}

        {!active ? (
          <ArrowDown className="h-4 w-4 text-slate-300" />
        ) : sortDirection === "asc" ? (
          <ArrowUp className="h-4 w-4 text-blue-600" />
        ) : (
          <ArrowDown className="h-4 w-4 text-blue-600" />
        )}
      </button>
    </th>
  );
}
