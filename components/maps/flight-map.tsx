"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

// FIX ICON
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function FlightMap() {
  return (
    <div className="overflow-hidden rounded-[28px] border bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h1 className="text-2xl font-bold">
          Flight Map
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Drone operation area
        </p>
      </div>

      <div className="h-[500px] w-full">
        <MapContainer
          center={[-7.802, 110.374]}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          {/* GOOGLE SATELLITE */}
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            attribution="&copy; Google"
          />

          {/* MARKER */}
          <Marker position={[-7.802, 110.374]}>
            <Popup>
              Drone Flight Area
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}