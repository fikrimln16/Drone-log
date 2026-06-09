"use client";

import { useMapEvents } from "react-leaflet";

type Props = {
  onPick: (lat: number, lng: number) => void;
};

export default function MapClickHandler({ onPick }: Props) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
