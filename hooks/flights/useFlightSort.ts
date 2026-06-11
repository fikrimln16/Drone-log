"use client";

import { useMemo, useState } from "react";

export type SortKey =
  | "flight_date"
  | "ama"
  | "estate"
  | "flight_id"
  | "mission_name"
  | "pilots"
  | "battery_id"
  | "duration_min";

export default function useFlightSort(flights: any[]) {
  const [sortBy, setSortBy] = useState<SortKey>("flight_date");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedFlights = useMemo(() => {
    return [...flights].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case "flight_date":
          valueA = new Date(a.flight_date || 0).getTime();

          valueB = new Date(b.flight_date || 0).getTime();
          break;

        case "duration_min":
          valueA = Number(a.duration_min || 0);

          valueB = Number(b.duration_min || 0);
          break;

        case "pilots":
          valueA = Array.isArray(a.pilots) ? a.pilots[0] || "" : "";

          valueB = Array.isArray(b.pilots) ? b.pilots[0] || "" : "";
          break;

        default:
          valueA = String(a[sortBy] || "").toLowerCase();

          valueB = String(b[sortBy] || "").toLowerCase();
      }

      // STRING
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // NUMBER / DATE
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [flights, sortBy, sortDirection]);

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("asc");
    }
  }

  return {
    sortBy,
    sortDirection,
    handleSort,
    sortedFlights,
  };
}
