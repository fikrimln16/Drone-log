"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { useEffect } from "react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

type Props = {
  ama: any;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],
});

function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 10, {
      duration: 1.5,
    });
  }, [lat, lng, map]);

  return null;
}

export default function AmaDetailMapLeaflet({ ama }: Props) {
  const lat = Number(ama.latitude);

  const lng = Number(ama.longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <p className="text-gray-500">Invalid coordinate</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={10}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <FlyToLocation lat={lat} lng={lng} />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]} icon={markerIcon}>
        <Popup>
          <div className="space-y-2">
            <h1 className="text-lg font-bold">{ama.ama_name}</h1>

            <p>
              Status: <span className="font-semibold">{ama.status}</span>
            </p>

            <p>
              Flights:{" "}
              <span className="font-semibold">{ama.total_flights}</span>
            </p>

            <p>
              Missions:{" "}
              <span className="font-semibold">{ama.total_missions}</span>
            </p>

            <p className="text-xs text-gray-500">
              {lat}, {lng}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
