"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import L from "leaflet";

// =====================================================
// FIX DEFAULT MARKER
// =====================================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  lat: number;

  lng: number;

  ama: string;

  status: string;
};

// =====================================================
// STATUS COLOR
// =====================================================

function getStatusColor(status: string) {
  switch (status) {
    case "SUCCESS":
      return "#22c55e";

    case "ONGOING":
      return "#f59e0b";

    default:
      return "#ef4444";
  }
}

// =====================================================
// CUSTOM MARKER
// =====================================================

function createCustomMarker(color: string) {
  return L.divIcon({
    html: `
      <div
        style="
          width:22px;
          height:22px;
          background:${color};
          border-radius:999px;
          border:4px solid white;
          box-shadow:0 0 15px rgba(0,0,0,.35);
        "
      />
    `,

    className: "",

    iconSize: [22, 22],
  });
}

export default function FlightDetailMap({ lat, lng, ama, status }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={10}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      {/* ================================================= */}
      {/* SATELLITE */}
      {/* ================================================= */}

      <TileLayer
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        attribution="Google Satellite"
      />

      {/* ================================================= */}
      {/* MARKER */}
      {/* ================================================= */}

      <Marker
        position={[lat, lng]}
        icon={createCustomMarker(getStatusColor(status))}
      >
        <Popup>
          <div className="min-w-[220px] space-y-3">
            {/* AMA */}
            <div>
              <h1 className="text-lg font-bold">{ama}</h1>

              <p className="text-sm text-gray-500">Drone operation point</p>
            </div>

            {/* STATUS */}
            <div
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                status === "SUCCESS"
                  ? "bg-green-100 text-green-700"
                  : status === "ONGOING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </div>

            {/* COORDINATE */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-5">
                <span className="text-gray-400">Latitude</span>

                <span className="font-semibold">{lat}</span>
              </div>

              <div className="flex items-center justify-between gap-5">
                <span className="text-gray-400">Longitude</span>

                <span className="font-semibold">{lng}</span>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
