"use client";

import { useEffect, useState } from "react";

import AmaDetailMap from "./ama-detail-map";

import AmaFlightTable from "./ama-flight-table";

import FlightDetailModal from "../flights/flight-detail-modal";

type Ama = {
  id: number;

  ama_name: string;

  latitude: number;

  longitude: number;

  status: string;

  total_flights: number;

  total_missions: number;
};

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
  selectedAma: Ama | null;
};

export default function AmaDetailSection({ selectedAma }: Props) {
  const [flights, setFlights] = useState<Flight[]>([]);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  useEffect(() => {
    async function fetchFlights() {
      if (!selectedAma) return;

      try {
        const response = await fetch(`/api/amas/${selectedAma.id}/flights`);

        const data = await response.json();

        setFlights(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchFlights();
  }, [selectedAma]);

  if (!selectedAma) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-[32px] border bg-white shadow-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700">
            Select AMA Activity
          </h1>

          <p className="mt-3 text-gray-500">
            Click AMA activity card to display detail
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MAP */}
      <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-7 py-6">
          <div>
            <h1 className="text-3xl font-bold">AMA Detail Location</h1>

            <p className="mt-1 text-sm text-gray-500">
              Selected operational area
            </p>
          </div>

          <span
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              selectedAma.status === "SUCCESS"
                ? "bg-green-100 text-green-700"
                : selectedAma.status === "ONGOING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {selectedAma.status}
          </span>
        </div>

        <div className="h-[450px]">
          <AmaDetailMap ama={selectedAma} />
        </div>
      </div>

      {/* TABLE */}
      <AmaFlightTable
        flights={flights}
        onDetail={(flight) => setSelectedFlight(flight)}
      />

      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />
    </div>
  );
}
