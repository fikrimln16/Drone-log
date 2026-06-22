"use client";

import { useEffect } from "react";

import { useMap } from "react-leaflet";

type Props = {
  lat: number;
  lng: number;
};

export default function FlyToLocation({ lat, lng }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng) return;

    map.flyTo([lat, lng], 18, {
      animate: true,
      duration: 2,
    });
  }, [lat, lng, map]);

  return null;
}
