"use client";

import dynamic from "next/dynamic";

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

const AmaMonitorMapLeaflet = dynamic(
  () => import("./ama-monitoring-map-leaflet"),
  {
    ssr: false,
  }
);

export default function AmaMonitorMap({ amas, onSelectAma }: Props) {
  return <AmaMonitorMapLeaflet amas={amas} onSelectAma={onSelectAma} />;
}
