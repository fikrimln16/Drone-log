import { ArrowDown, ArrowUp } from "lucide-react";

type SortKey =
  | "pilot"
  | "performance"
  | "total_missions"
  | "total_flights"
  | "total_duration"
  | "avg_duration"
  | "last_flight"
  | "status";

type Props = {
  label: string;
  field: SortKey;
  sortBy: SortKey;
  sortDirection: "asc" | "desc";
  onSort: (key: SortKey) => void;
  className?: string;
};

export default function PilotSortHeader({
  label,
  field,
  sortBy,
  sortDirection,
  onSort,
  className,
}: Props) {
  const active = sortBy === field;

  return (
    <th
      className={`px-6 py-5 text-center text-xs font-bold tracking-wider uppercase ${className}`}
    >
      <button
        onClick={() => onSort(field)}
        className="mx-auto flex items-center justify-center gap-2 text-slate-500 transition hover:text-cyan-600"
      >
        {label}

        {!active ? (
          <ArrowDown className="h-4 w-4 text-slate-300" />
        ) : sortDirection === "asc" ? (
          <ArrowUp className="h-4 w-4 text-cyan-600" />
        ) : (
          <ArrowDown className="h-4 w-4 text-cyan-600" />
        )}
      </button>
    </th>
  );
}
