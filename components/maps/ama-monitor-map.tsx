"use client";

import { useEffect, useState } from "react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";

import {
  CheckCircle2,
  MapPinned,
  RadioTower,
} from "lucide-react";

// =====================================================
// FIX LEAFLET MARKER
// =====================================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =====================================================
// TYPES
// =====================================================

type AmaPoint = {
  id: number;

  ama: string;

  lat: number;

  lng: number;

  total_flights: number;

  total_missions: number;

  latest_flight: string;

  missions: string[];
};

// =====================================================
// COMPONENT
// =====================================================

export default function AmaMonitorMap() {
  const [amaPoints, setAmaPoints] = useState<AmaPoint[]>([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    fetchAmaData();
  }, []);

  async function fetchAmaData() {
    try {
      const res = await fetch("/api/maps/ama");

      const data = await res.json();

      setAmaPoints(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-[32px] border bg-white p-10 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-[250px] rounded-xl bg-gray-200" />

          <div className="h-[500px] rounded-3xl bg-gray-100" />
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
      {/* ===================================================== */}
      {/* MAP */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm xl:col-span-3">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              AMA Drone Monitoring
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Real-time Indonesia drone operation map
            </p>
          </div>

          <div className="rounded-2xl bg-blue-100 p-4">
            <MapPinned className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {/* MAP */}
        <div className="h-[520px] w-full">
          <MapContainer
            center={[-2.5, 118]}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            {/* GOOGLE SATELLITE */}
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution="Google Satellite"
            />

            {/* MARKER */}
            {amaPoints.map((item) => (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
              >
                <Popup>
                  <div className="min-w-[260px]">
                    {/* TITLE */}
                    <div>
                      <h1 className="text-lg font-bold">
                        {item.ama}
                      </h1>

                      <p className="text-xs text-gray-500">
                        AMA drone monitoring area
                      </p>
                    </div>

                    {/* STATS */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {/* FLIGHT */}
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-400">
                          Flights
                        </p>

                        <h1 className="mt-1 text-lg font-bold">
                          {item.total_flights}
                        </h1>
                      </div>

                      {/* MISSION */}
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-400">
                          Missions
                        </p>

                        <h1 className="mt-1 text-lg font-bold">
                          {item.total_missions}
                        </h1>
                      </div>
                    </div>

                    {/* LAST FLIGHT */}
                    <div className="mt-4 rounded-xl bg-blue-50 p-3">
                      <p className="text-xs text-blue-500">
                        Latest Flight
                      </p>

                      <h1 className="mt-1 font-semibold text-blue-700">
                        {item.latest_flight
                          ? new Date(
                              item.latest_flight
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </h1>
                    </div>

                    {/* MISSION LIST */}
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold text-gray-400 uppercase">
                        Mission List
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.missions?.map(
                          (mission: string) => (
                            <span
                              key={mission}
                              className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
                            >
                              {mission}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* COORDINATE */}
                    <div className="mt-4 border-t pt-3 text-xs text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>Latitude</span>

                        <span className="font-medium text-gray-600">
                          {item.lat}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span>Longitude</span>

                        <span className="font-medium text-gray-600">
                          {item.lng}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* ===================================================== */}
      {/* RIGHT PANEL */}
      {/* ===================================================== */}

      <div className="xl:col-span-1">
        <div className="rounded-[32px] border bg-white p-6 shadow-sm">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Mission Information
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Indonesia AMA monitoring overview
              </p>
            </div>

            <div className="rounded-2xl bg-purple-100 p-4">
              <RadioTower className="h-6 w-6 text-purple-600" />
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 space-y-4">
            {/* TOTAL AMA */}
            <div className="rounded-2xl border bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Total AMA Point
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-4xl font-bold">
                  {amaPoints.length}
                </h1>

                <div className="rounded-xl bg-blue-100 p-3">
                  <MapPinned className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Registered drone monitoring area
              </p>
            </div>

            {/* TOTAL FLIGHT */}
            <div className="rounded-2xl border bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Total Flights
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-4xl font-bold">
                  {amaPoints.reduce(
                    (acc, item) =>
                      acc + item.total_flights,
                    0
                  )}
                </h1>

                <div className="rounded-xl bg-green-100 p-3">
                  <RadioTower className="h-5 w-5 text-green-600" />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Total drone flight operation
              </p>
            </div>

            {/* TOTAL MISSION */}
            <div className="rounded-2xl border bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Total Missions
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-4xl font-bold">
                  {amaPoints.reduce(
                    (acc, item) =>
                      acc + item.total_missions,
                    0
                  )}
                </h1>

                <div className="rounded-xl bg-yellow-100 p-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-600" />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Registered drone mission
              </p>
            </div>

            {/* LAST UPDATE */}
            <div className="rounded-2xl border bg-gray-50 p-5">
              <p className="text-sm text-gray-500">
                Last Sync
              </p>

              <div className="mt-3">
                <h1 className="text-2xl font-bold">
                  {new Date().toLocaleDateString(
                    "id-ID"
                  )}
                </h1>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  <div className="h-2 w-2 rounded-full bg-green-500" />

                  Synced Successfully
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}