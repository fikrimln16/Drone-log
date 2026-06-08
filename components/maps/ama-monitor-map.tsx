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
  MapPinned,
  RadioTower,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

// =====================================================
// FIX LEAFLET
// =====================================================

delete (L.Icon.Default.prototype as any)
  ._getIconUrl;

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

  status: "SUCCESS" | "ONGOING" | "PENDING";

  total_flights: number;

  total_missions: number;

  latest_flight: string | null;

  missions: string[];
};

// =====================================================
// MARKER COLOR
// =====================================================

function getMarkerColor(status: string) {
  switch (status) {
    case "SUCCESS":
      return "#22c55e";

    case "ONGOING":
      return "#f59e0b";

    case "PENDING":
      return "#ef4444";

    default:
      return "#94a3b8";
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
          width:20px;
          height:20px;
          background:${color};
          border-radius:999px;
          border:4px solid white;
          box-shadow:0 0 15px rgba(0,0,0,.35);
        "
      ></div>
    `,

    className: "",

    iconSize: [20, 20],
  });
}

// =====================================================
// COMPONENT
// =====================================================

export default function AmaMonitorMap() {
  const [amaPoints, setAmaPoints] =
    useState<AmaPoint[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    async function fetchMapData() {
      try {
        const res = await fetch("/api/maps/ama");

        if (!res.ok) {
          throw new Error(
            "Failed fetch map data"
          );
        }

        const data = await res.json();

        console.log("MAP DATA:", data);

        if (Array.isArray(data)) {
          setAmaPoints(data);
        } else {
          setAmaPoints([]);
        }
      } catch (error) {
        console.error(error);

        setAmaPoints([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMapData();
  }, []);

  // =====================================================
  // STATS
  // =====================================================

  const successCount = amaPoints.filter(
    (item) => item.status === "SUCCESS"
  ).length;

  const ongoingCount = amaPoints.filter(
    (item) => item.status === "ONGOING"
  ).length;

  const pendingCount = amaPoints.filter(
    (item) => item.status === "PENDING"
  ).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex h-[650px] items-center justify-center rounded-[32px] border bg-white">
        <p className="text-gray-500">
          Loading map...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
      {/* ================================================= */}
      {/* MAP */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm xl:col-span-3">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              AMA Drone Monitoring
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Real-time Indonesia drone
              operation map
            </p>
          </div>

          <div className="rounded-2xl bg-blue-100 p-4">
            <MapPinned className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        {/* MAP */}
        <div className="h-[560px] w-full">
          <MapContainer
            center={[-2.5, 118]}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            {/* SATELLITE */}
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution="Google Satellite"
            />

            {/* MARKERS */}
            {amaPoints.map((item) => (
              <Marker
                key={item.id}
                position={[
                  Number(item.lat),
                  Number(item.lng),
                ]}
                icon={createCustomMarker(
                  getMarkerColor(
                    item.status
                  )
                )}
              >
                <Popup>
                  <div className="min-w-[240px]">
                    {/* TITLE */}
                    <div>
                      <h1 className="text-lg font-bold">
                        {item.ama}
                      </h1>

                      <p className="text-xs text-gray-500">
                        Drone monitoring
                        point
                      </p>
                    </div>

                    {/* STATUS */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-400">
                        Status
                      </p>

                      <div
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status ===
                          "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : item.status ===
                                "ONGOING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                          Flights
                        </span>

                        <span className="font-semibold">
                          {
                            item.total_flights
                          }
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                          Missions
                        </span>

                        <span className="font-semibold">
                          {
                            item.total_missions
                          }
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                          Latitude
                        </span>

                        <span className="font-semibold">
                          {item.lat}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                          Longitude
                        </span>

                        <span className="font-semibold">
                          {item.lng}
                        </span>
                      </div>
                    </div>

                    {/* MISSION LIST */}
                    <div className="mt-5">
                      <p className="mb-2 text-xs text-gray-400">
                        Mission List
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.missions
                          ?.length > 0 ? (
                          item.missions.map(
                            (
                              mission,
                              index
                            ) => (
                              <div
                                key={
                                  index
                                }
                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                              >
                                {
                                  mission
                                }
                              </div>
                            )
                          )
                        ) : (
                          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                            No mission
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* ================================================= */}
      {/* RIGHT PANEL */}
      {/* ================================================= */}

      <div className="xl:col-span-1">
        <div className="rounded-[32px] border bg-white p-6 shadow-sm">
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Mission Information
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Indonesia AMA monitoring
                overview
              </p>
            </div>

            <div className="rounded-2xl bg-purple-100 p-4">
              <RadioTower className="h-6 w-6 text-purple-600" />
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-6 space-y-4">
            {/* TOTAL */}
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
            </div>

            {/* SUCCESS */}
            <div className="flex items-center justify-between rounded-2xl bg-green-50 px-5 py-4">
              <div>
                <p className="font-semibold text-green-700">
                  Success
                </p>

                <p className="text-xs text-green-600">
                  Finished mission
                </p>
              </div>

              <h1 className="text-3xl font-bold text-green-700">
                {successCount}
              </h1>
            </div>

            {/* ONGOING */}
            <div className="flex items-center justify-between rounded-2xl bg-yellow-50 px-5 py-4">
              <div>
                <p className="font-semibold text-yellow-700">
                  Ongoing
                </p>

                <p className="text-xs text-yellow-600">
                  Active monitoring
                </p>
              </div>

              <h1 className="text-3xl font-bold text-yellow-700">
                {ongoingCount}
              </h1>
            </div>

            {/* PENDING */}
            <div className="flex items-center justify-between rounded-2xl bg-red-50 px-5 py-4">
              <div>
                <p className="font-semibold text-red-700">
                  Pending
                </p>

                <p className="text-xs text-red-600">
                  Waiting operation
                </p>
              </div>

              <h1 className="text-3xl font-bold text-red-700">
                {pendingCount}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}