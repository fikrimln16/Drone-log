"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Ama = {
  id: number;

  ama_name: string;

  latitude: number;

  longitude: number;

  status: string;

  total_flights: number;

  total_missions: number;

  last_flight: string;
};

type Props = {
  amas: Ama[];

  onSelectAma?: (ama: Ama) => void;
};

function getColor(status: string) {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
      return "#22c55e";

    case "ONGOING":
      return "#f59e0b";

    default:
      return "#ef4444";
  }
}

export default function AmaMonitorMapLeaflet({ amas, onSelectAma }: Props) {
  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      scrollWheelZoom
      className="h-full w-full"
    >
      {/* SATELLITE */}
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        attribution="Google Satellite"
      />

      {/* MARKERS */}
      {amas.map((ama) => (
        <CircleMarker
          key={ama.id}
          center={[ama.latitude, ama.longitude]}
          radius={8}
          pathOptions={{
            color: "white",
            weight: 3,
            fillColor: getColor(ama.status),
            fillOpacity: 1,
          }}
          eventHandlers={{
            click: () => {
              onSelectAma?.(ama);
            },
          }}
        >
          <Popup>
            <div className="min-w-[220px]">
              <h1 className="text-lg font-bold">{ama.ama_name}</h1>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-5">
                  <span>Status</span>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      ama.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : ama.status === "ONGOING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ama.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Flights</span>

                  <span className="font-semibold">{ama.total_flights}</span>
                </div>

                <div className="flex justify-between">
                  <span>Missions</span>

                  <span className="font-semibold">{ama.total_missions}</span>
                </div>

                <div className="flex justify-between">
                  <span>Latitude</span>

                  <span className="font-semibold">{ama.latitude}</span>
                </div>

                <div className="flex justify-between">
                  <span>Longitude</span>

                  <span className="font-semibold">{ama.longitude}</span>
                </div>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
