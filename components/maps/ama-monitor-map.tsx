"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import { useEffect, useMemo, useState } from "react";

import L from "leaflet";

import { MapPinned, RadioTower, X } from "lucide-react";

import Link from "next/link";

import AddAmaModal from "@/components/flights/modals/add-ama-modal";

import EditAmaStatusModal from "@/components/flights/modals/edit-ama-status-modal";

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

  planning_date: string | null;

  actual_date: string | null;
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
      return "#f97316";
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

function formatDateOnly(date: string | null) {
  if (!date) return null;

  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// =====================================================
// MAP PICKER
// =====================================================

function MapClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

// =====================================================
// COMPONENT
// =====================================================

export default function AmaMonitorMap() {
  const [amaPoints, setAmaPoints] = useState<AmaPoint[]>([]);

  const [loading, setLoading] = useState(true);

  // STATUS MODAL
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("");

  // ADD AMA MODAL
  const [openAddAma, setOpenAddAma] = useState(false);

  // EDIT STATUS MODAL
  const [openEditStatus, setOpenEditStatus] = useState(false);

  // NEW AMA
  const [newAma, setNewAma] = useState({
    ama_name: "",

    status: "PENDING",

    latitude: "",

    longitude: "",
  });

  // =====================================================
  // FETCH MAP DATA
  // =====================================================

  // =====================================================
  // FETCH MAP DATA
  // =====================================================

  async function fetchMapData() {
    try {
      setLoading(true);

      const response = await fetch("/api/maps/ama");

      const data = await response.json();

      setAmaPoints(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
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

  const waitingCount = useMemo(() => {
    return amaPoints.filter((item) => item.status?.toUpperCase() === "WAITING")
      .length;
  }, [amaPoints]);

  // =====================================================
  // FILTER DATA
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
      {/* ================================================= */}
      {/* MAIN LAYOUT */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* ================================================= */}
        {/* MAP */}
        {/* ================================================= */}

        <div className="overflow-scroll rounded-[32px] border bg-white shadow-sm xl:col-span-3">
          {/* MAP */}
          <div className="h-full w-full">
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
                    <div className="w-[260px] space-y-4">
                      {/* ================================================= */}
                      {/* HEADER */}
                      {/* ================================================= */}

                      <div>
                        <h1 className="text-lg leading-tight font-bold text-slate-800">
                          {item.ama}
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                          Drone Monitoring Area
                        </p>
                      </div>

                      {/* ================================================= */}
                      {/* STATUS */}
                      {/* ================================================= */}

                      <div className="rounded-2xl border bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Status
                          </p>

                          <div
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-sm ${
                              item.status === "SUCCESS"
                                ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                : item.status === "ONGOING"
                                  ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
                                  : "bg-orange-100 text-orange-800 ring-1 ring-orange-200"
                            }`}
                          >
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                item.status === "SUCCESS"
                                  ? "bg-green-500"
                                  : item.status === "ONGOING"
                                    ? "bg-yellow-500"
                                    : "bg-orange-500"
                              }`}
                            />

                            {item.status === "SUCCESS"
                              ? "Completed"
                              : item.status === "ONGOING"
                                ? "Ongoing"
                                : "Waiting"}
                          </div>
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* FLIGHT INFORMATION */}
                      {/* ================================================= */}

                      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                              Total Flights
                            </p>

                            <h1 className="mt-2 text-4xl font-bold text-slate-800">
                              {item.total_flights}
                            </h1>
                          </div>

                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-7 w-7 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.18 9"
                              />

                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l4-1 4 1v-1.5L13 19v-5.5L21 16z"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* LAST FLIGHT */}
                        <div className="mt-4 rounded-xl bg-slate-100 px-3 py-2">
                          <p className="text-[10px] text-slate-400">
                            Last Flight Activity
                          </p>

                          <h1 className="mt-1 text-xs font-semibold text-slate-700">
                            {item.latest_flight
                              ? formatDateOnly(item.latest_flight)
                              : "No flight activity"}
                          </h1>
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* DATE INFORMATION */}
                      {/* ================================================= */}

                      <div className="grid grid-cols-2 gap-3">
                        {/* PLANNING */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                          <p className="text-[10px] font-medium text-blue-500">
                            Planning
                          </p>

                          <h1 className="mt-1 text-[11px] leading-tight font-semibold text-blue-700">
                            {item.planning_date
                              ? formatDateOnly(item.planning_date)
                              : "No Planning"}
                          </h1>
                        </div>

                        {/* ACTUAL */}
                        <div className="rounded-xl border border-purple-100 bg-purple-50 p-3">
                          <p className="text-[10px] font-medium text-purple-500">
                            Actual
                          </p>

                          <h1 className="mt-1 text-[11px] leading-tight font-semibold text-purple-700">
                            {item.actual_date
                              ? formatDateOnly(item.actual_date)
                              : "Waiting"}
                          </h1>
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
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-yellow-700">
                    {ongoingCount}
                  </h1>

                  <div className="transition group-hover:translate-x-1">→</div>
                </div>
              </button>

              {/* PENDING */}
              {/* WAITING */}
              <button
                onClick={() => {
                  setSelectedStatus("WAITING");

                  setOpenStatusModal(true);
                }}
                className="group flex w-full items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 px-5 py-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-orange-700">Waiting</p>

                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-orange-700 shadow-sm">
                      CLICK
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-orange-600">
                    Waiting operation
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-orange-700">
                    {waitingCount}
                  </h1>

                  <div className="transition group-hover:translate-x-1">→</div>
                </div>
              </button>

              {/* QUICK ACTION */}
              <div className="mt-auto grid grid-cols-2 gap-3">
                {/* ADD AMA */}
                <button
                  onClick={() => setOpenAddAma(true)}
                  className="group flex items-center justify-between rounded-2xl border bg-white px-4 py-4 transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-100 p-3 transition group-hover:bg-blue-200">
                      <MapPinned className="h-5 w-5 text-blue-600" />
                    </div>

                    <div className="text-left">
                      <h1 className="text-sm font-bold">Add AMA</h1>

                      <p className="mt-1 text-[11px] text-gray-500">
                        New location
                      </p>
                    </div>
                  </div>
                </button>

                {/* EDIT STATUS */}
                <button
                  onClick={() => setOpenEditStatus(true)}
                  className="group flex items-center justify-between rounded-2xl border bg-white px-4 py-4 transition hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-purple-100 p-3 transition group-hover:bg-purple-200">
                      <RadioTower className="h-5 w-5 text-purple-600" />
                    </div>

                    <div className="text-left">
                      <h1 className="text-sm font-bold">Edit Status</h1>

                      <p className="mt-1 text-[11px] text-gray-500">
                        AMA condition
                      </p>
                    </div>
                  </div>
                </button>
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
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.status}
                      </div>
                    </div>

                    {/* MISSIONS */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.missions?.length > 0 ? (
                        item.missions.map((mission: string, index: number) => (
                          <button
                            key={index}
                            onClick={() =>
                              (window.location.href = `/missions/${encodeURIComponent(mission)}`)
                            }
                            className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:scale-[1.03] hover:bg-blue-100 hover:text-blue-800"
                          >
                            {mission}
                          </button>
                        ))
                      ) : (
                        <div className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-500">
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

      <AddAmaModal
        open={openAddAma}
        onClose={() => setOpenAddAma(false)}
        onSuccess={fetchMapData}
      />

      <EditAmaStatusModal
        open={openEditStatus}
        onClose={() => setOpenEditStatus(false)}
        amaPoints={amaPoints}
        onSuccess={fetchMapData}
      />
    </>
  );
}
