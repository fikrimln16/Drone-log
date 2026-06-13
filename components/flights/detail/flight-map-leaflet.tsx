"use client";

import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Props = {
  data: any;
};

export default function FlightMapLeaflet({ data }: Props) {
  const lat = Number(data.latitude);

  const lng = Number(data.longitude);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{
        height: "280px",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        attribution="Google Satellite"
      />

      <CircleMarker
        center={[lat, lng]}
        radius={10}
        pathOptions={{
          color: "white",
          weight: 3,
          fillColor: "#22c55e",
          fillOpacity: 1,
        }}
      >
        <Tooltip permanent direction="top">
          {data.ama_name}
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
