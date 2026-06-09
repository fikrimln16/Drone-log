"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { useEffect, useMemo, useState } from "react";

import L from "leaflet";

import { MapPinned, RadioTower, X } from "lucide-react";

import Link from "next/link";

// =====================================================
// FIX MARKER
// =====================================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =====================================================
// TYPES
// =====================================================

type AmaPoint = {
  id: number;

  ama: string;

  lat: number;

  lng: number;

  status: string;

  total_flights: number;

  total_missions: number;

  latest_flight: string | null;

  missions: string[];
};

// =====================================================
// MARKER COLOR
// =====================================================

function getMarkerColor(status: string) {
  switch (status?.toUpperCase()) {
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
          width:18px;
          height:18px;
          background:${color};
          border-radius:999px;
          border:3px solid white;
          box-shadow:0 0 10px rgba(0,0,0,.25);
        "
      />
    `,

    className: "",

    iconSize: [18, 18],
  });
}

export default function AmaMonitorMap() {
  const [amaPoints, setAmaPoints] = useState<AmaPoint[]>([]);

  const [loading, setLoading] = useState(true);

  const [openStatusModal, setOpenStatusModal] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");

  // =====================================================
  // FETCH MAP DATA
  // =====================================================

  useEffect(() => {
    async function fetchMapData() {
      try {
        const response = await fetch("/api/maps/ama");

        const data = await response.json();

        setAmaPoints(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMapData();
  }, []);

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const successCount = useMemo(() => {
    return amaPoints.filter((item) => item.status?.toUpperCase() === "SUCCESS")
      .length;
  }, [amaPoints]);

  const ongoingCount = useMemo(() => {
    return amaPoints.filter((item) => item.status?.toUpperCase() === "ONGOING")
      .length;
  }, [amaPoints]);

  const pendingCount = useMemo(() => {
    return amaPoints.filter((item) => item.status?.toUpperCase() === "PENDING")
      .length;
  }, [amaPoints]);

  // =====================================================
  // FILTER MODAL DATA
  // =====================================================

  const filteredStatusData = amaPoints.filter(
    (item) => item.status?.toUpperCase() === selectedStatus
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-[32px] border bg-white p-10 shadow-sm">
        Loading map...
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* ================================================= */}
        {/* MAP */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm xl:col-span-3">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h1 className="text-2xl font-bold">AMA Drone Monitoring</h1>

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

              {/* MARKERS */}
              {amaPoints.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.lat, item.lng]}
                  icon={createCustomMarker(getMarkerColor(item.status))}
                >
                  <Popup>
                    <div className="min-w-[230px] space-y-3">
                      <div>
                        <h1 className="text-lg font-bold">{item.ama}</h1>

                        <p className="text-xs text-gray-500">
                          Drone monitoring point
                        </p>
                      </div>

                      {/* STATUS */}
                      <div>
                        <p className="text-xs text-gray-400">Status</p>

                        <div
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "SUCCESS"
                              ? "bg-green-100 text-green-700"
                              : item.status === "ONGOING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Flights</p>

                          <h1 className="font-semibold">
                            {item.total_flights}
                          </h1>
                        </div>

                        <div>
                          <p className="text-gray-400">Missions</p>

                          <h1 className="font-semibold">
                            {item.total_missions}
                          </h1>
                        </div>

                        <div>
                          <p className="text-gray-400">Latitude</p>

                          <h1 className="font-semibold">{item.lat}</h1>
                        </div>

                        <div>
                          <p className="text-gray-400">Longitude</p>

                          <h1 className="font-semibold">{item.lng}</h1>
                        </div>
                      </div>

                      {/* MISSION LIST */}
                      {/* MISSION LIST */}
                      <div>
                        <p className="mb-2 text-xs text-gray-400">
                          Mission List
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.missions?.length > 0 ? (
                            item.missions.map((mission, index) => (
                              <Link
                                key={index}
                                href={`/missions/${mission}`}
                                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                              >
                                {mission}
                              </Link>
                            ))
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
          <div className="flex h-full flex-col rounded-[32px] border bg-white p-6 shadow-sm">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Mission Information</h1>

                <p className="mt-1 text-sm text-gray-500">
                  Indonesia AMA monitoring overview
                </p>
              </div>

              <div className="rounded-2xl bg-purple-100 p-4">
                <RadioTower className="h-6 w-6 text-purple-600" />
              </div>
            </div>

            {/* CONTENT */}
            <div className="mt-6 flex flex-1 flex-col gap-4">
              {/* TOTAL */}
              <div className="rounded-2xl border bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Total AMA Point</p>

                <div className="mt-3 flex items-center justify-between">
                  <h1 className="text-4xl font-bold">{amaPoints.length}</h1>

                  <div className="rounded-xl bg-blue-100 p-3">
                    <MapPinned className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* SUCCESS */}
              <button
                onClick={() => {
                  setSelectedStatus("SUCCESS");

                  setOpenStatusModal(true);
                }}
                className="group flex w-full items-center justify-between rounded-2xl border border-green-200 bg-green-50 px-5 py-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-green-700">Success</p>

                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-green-700 shadow-sm">
                      CLICK
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-green-600">
                    Finished mission
                  </p>

                  <p className="mt-3 text-xs font-medium text-green-700 opacity-70">
                    Click to view AMA list
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-green-700">
                    {successCount}
                  </h1>

                  <div className="transition group-hover:translate-x-1">→</div>
                </div>
              </button>

              {/* ONGOING */}
              <button
                onClick={() => {
                  setSelectedStatus("ONGOING");

                  setOpenStatusModal(true);
                }}
                className="group flex w-full items-center justify-between rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-yellow-700">Ongoing</p>

                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-yellow-700 shadow-sm">
                      CLICK
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-yellow-600">
                    Active monitoring
                  </p>

                  <p className="mt-3 text-xs font-medium text-yellow-700 opacity-70">
                    Click to view AMA list
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-yellow-700">
                    {ongoingCount}
                  </h1>

                  <div className="transition group-hover:translate-x-1">→</div>
                </div>
              </button>

              {/* PENDING */}
              <button
                onClick={() => {
                  setSelectedStatus("PENDING");

                  setOpenStatusModal(true);
                }}
                className="group flex w-full items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-red-700">Pending</p>

                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-red-700 shadow-sm">
                      CLICK
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-red-600">Waiting operation</p>

                  <p className="mt-3 text-xs font-medium text-red-700 opacity-70">
                    Click to view AMA list
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-red-700">
                    {pendingCount}
                  </h1>

                  <div className="transition group-hover:translate-x-1">→</div>
                </div>
              </button>

              {/* LAST SYNC */}
              <div className="mt-auto rounded-2xl border bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Last Sync</p>

                <div className="mt-3">
                  <h1 className="text-2xl font-bold">
                    {new Date().toLocaleDateString()}
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

      {/* ================================================= */}
      {/* STATUS MODAL */}
      {/* ================================================= */}

      {openStatusModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[700px] rounded-[32px] bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-8 py-6">
              <div>
                <h1 className="text-3xl font-bold">{selectedStatus} AMA</h1>

                <p className="mt-1 text-sm text-gray-500">
                  Monitoring point list
                </p>
              </div>

              <button
                onClick={() => setOpenStatusModal(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="max-h-[500px] overflow-y-auto p-8">
              <div className="space-y-4">
                {filteredStatusData.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border bg-gray-50 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-xl font-bold">{item.ama}</h1>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.total_flights} flights
                        </p>
                      </div>

                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : item.status === "ONGOING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>

                    {/* MISSIONS */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.missions?.length > 0 ? (
                        item.missions.map((mission, index) => (
                          <Link
                            key={index}
                            href={`/missions/${mission}`}
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                          >
                            {mission}
                          </Link>
                        ))
                      ) : (
                        <div className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                          No mission
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
