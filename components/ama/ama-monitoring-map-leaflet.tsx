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
      return "#22c55e"; // green-500

    case "ONGOING":
      return "#0ea5e9"; // sky-500

    case "NEXT":
      return "#f97316"; // orange-500

    case "WAITING":
      return "#eab308"; // yellow-500

    default:
      return "#94a3b8"; // slate-400
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
            color: "#ffffff",
            weight: 3,
            fillColor: getColor(ama.status),
            fillOpacity: 1,
            opacity: 1,
          }}
          eventHandlers={{
            click: () => {
              onSelectAma?.(ama);
            },
          }}
          className="animate-pulse"
        >
          <Popup>
            <div className="min-w-[220px]">
              <h1 className="text-lg font-bold">{ama.ama_name}</h1>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-5">
                  <span>Status</span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                      ama.status === "SUCCESS"
                        ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                        : ama.status === "ONGOING"
                          ? "bg-sky-100 text-sky-800 ring-1 ring-sky-200"
                          : ama.status === "NEXT"
                            ? "bg-orange-100 text-orange-800 ring-1 ring-orange-200"
                            : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        ama.status === "SUCCESS"
                          ? "bg-green-500"
                          : ama.status === "ONGOING"
                            ? "bg-sky-500"
                            : ama.status === "NEXT"
                              ? "bg-orange-500"
                              : "bg-yellow-500"
                      }`}
                    />

                    {ama.status === "SUCCESS"
                      ? "Completed"
                      : ama.status === "ONGOING"
                        ? "On Progress"
                        : ama.status === "NEXT"
                          ? "Next"
                          : "Waiting"}
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

                {/* <div className="flex justify-between">
                  <span>Latitude</span>

                  <span className="font-semibold">{ama.latitude}</span>
                </div>

                <div className="flex justify-between">
                  <span>Longitude</span>

                  <span className="font-semibold">{ama.longitude}</span>
                </div> */}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
