"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { useEffect, useState } from "react";

import L from "leaflet";

// FIX LEAFLET
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  selectedAmaId?: number;

  onSelect: (ama: any) => void;
};

export default function AmaPickerMap({ selectedAmaId, onSelect }: Props) {
  const [amas, setAmas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAmas() {
      try {
        const response = await fetch("/api/amas");

        const data = await response.json();

        setAmas(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAmas();
  }, []);

  // CUSTOM MARKER
  function createMarker(selected: boolean) {
    return L.divIcon({
      html: `
        <div
          style="
            width:${selected ? "22px" : "18px"};
            height:${selected ? "22px" : "18px"};
            background:${selected ? "#2563eb" : "#ef4444"};
            border-radius:999px;
            border:3px solid white;
            box-shadow:0 0 12px rgba(0,0,0,.3);
          "
        />
      `,

      className: "",

      iconSize: [22, 22],
    });
  }

  return (
    <div>
      {/* LABEL */}
      <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
        Select AMA From Map
      </label>

      {/* MAP */}
      <div className="overflow-hidden rounded-2xl border">
        <MapContainer
          center={[-2.5, 118]}
          zoom={4}
          className="h-[320px] w-full"
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            attribution="Google Satellite"
          />

          {amas.map((item) => (
            <Marker
              key={item.id}
              position={[Number(item.latitude), Number(item.longitude)]}
              icon={createMarker(selectedAmaId === item.id)}
              eventHandlers={{
                click: () => {
                  onSelect(item);
                },
              }}
            >
              <Popup>
                <div className="space-y-2">
                  <h1 className="text-lg font-bold">{item.ama_name}</h1>

                  <p className="text-sm text-gray-500">Click to select AMA</p>

                  <div className="text-xs">Lat: {item.latitude}</div>

                  <div className="text-xs">Lng: {item.longitude}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
