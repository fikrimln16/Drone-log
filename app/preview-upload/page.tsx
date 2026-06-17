"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

import { AlertCircle, FileSpreadsheet, Upload, MapPinned } from "lucide-react";

import "leaflet/dist/leaflet.css";

// =====================================================
// LEAFLET DYNAMIC IMPORT
// =====================================================

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  {
    ssr: false,
  }
);

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  {
    ssr: false,
  }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// =====================================================
// TYPES
// =====================================================

type CSVRow = {
  flight_date: string;
  ama: string;
  mission_name: string;
  estate: string;
  pilot: string;
  uav_unit: string;
  battery_id: string;
  battery_id_2: string;
  battery_color: string;
  start_percent: string;
  end_percent: string;
  start_volt: string;
  end_volt: string;
  start_time: string;
  end_time: string;
  duration_min: string;
  notes: string;
};

export default function PreviewUploadPage() {
  const router = useRouter();

  // =====================================================
  // STATE
  // =====================================================

  const [rows, setRows] = useState<CSVRow[]>([]);

  const [loading, setLoading] = useState(false);

  const [missions, setMissions] = useState<any[]>([]);

  const [selectedMission, setSelectedMission] = useState("");

  const [isNewMission, setIsNewMission] = useState(false);

  const [selectedAma, setSelectedAma] = useState<any>(null);

  const [selectedMapAma, setSelectedMapAma] = useState<any>(null);

  const [amas, setAmas] = useState<any[]>([]);

  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  const [pilots, setPilots] = useState<any[]>([]);

  const [pilotMapping, setPilotMapping] = useState<Record<string, number>>({});

  const [newPilotMapping, setNewPilotMapping] = useState<
    Record<string, string>
  >({});

  const [amaMapping, setAmaMapping] = useState<Record<string, any>>({});
  const [expandedAma, setExpandedAma] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalType, setModalType] = useState<"success" | "error">("success");

  const [modalTitle, setModalTitle] = useState("");

  const [modalMessage, setModalMessage] = useState("");

  // =====================================================
  // LOAD CSV
  // =====================================================

  useEffect(() => {
    const data = localStorage.getItem("csv-preview");

    if (!data) {
      router.push("/");

      return;
    }

    setRows(JSON.parse(data));
  }, [router]);

  // =====================================================
  // FETCH DATA MISSION
  // =====================================================

  async function fetchData() {
    try {
      const missionRes = await fetch("/api/missions");

      setMissions(await missionRes.json());

      const amaRes = await fetch("/api/maps/ama");

      setAmas(await amaRes.json());

      const pilotRes = await fetch("/api/pilots/all");

      setPilots(await pilotRes.json());
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================
  // VALIDATION
  // =====================================================

  const invalidRows = useMemo(() => {
    return rows.filter(
      (row) => !row.flight_date || !row.battery_id || !row.mission_name
    );
  }, [rows]);

  // =====================================================
  // TOTAL DURATION
  // =====================================================

  const totalDuration = rows.reduce(
    (a, b) => a + Number(b.duration_min || 0),
    0
  );

  // =====================================================
  // DISABLE UPLOAD
  // =====================================================

  // =====================================================
  // HANDLE UPLOAD
  // =====================================================

  async function handleUpload() {
    try {
      setLoading(true);

      const payload = rows.map((item) => {
        const selectedAma = amaMapping[item.ama];

        return {
          ...item,

          ama_id: selectedAma?.id,

          latitude: selectedAma?.lat,

          longitude: selectedAma?.lng,

          pilot_mapping: pilotMapping,

          new_pilot_mapping: newPilotMapping,
        };
      });

      console.log(payload);
      const res = await fetch("/api/upload-json", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          flights: payload,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      setModalType("success");

      setModalTitle("Upload Successful");

      setModalMessage(result.message || "CSV uploaded successfully.");

      setModalOpen(true);

      localStorage.removeItem("csv-preview");

      setRows([]);
    } catch (error: any) {
      console.error(error);

      setModalType("error");

      setModalTitle("Upload Failed");

      setModalMessage(
        error?.message || "Unexpected error occurred while uploading."
      );

      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const groupedPilots = [
    ...new Set(
      rows.flatMap((row: any) =>
        String(row.pilot || "")
          .split("_")
          .map((pilot) => pilot.trim())
          .filter(Boolean)
      )
    ),
  ];

  const groupedAma = useMemo(() => {
    const map: Record<string, any> = {};

    rows.forEach((row) => {
      if (!map[row.ama]) {
        map[row.ama] = {
          ama: row.ama,

          totalFlights: 0,

          missions: new Set<string>(),

          pilots: new Set<string>(),

          rows: [],
        };
      }

      map[row.ama].totalFlights += 1;

      map[row.ama].missions.add(row.mission_name);

      String(row.pilot || "")
        .split("_")
        .map((pilot) => pilot.trim())
        .filter(Boolean)
        .forEach((pilot) => {
          map[row.ama].pilots.add(pilot);
        });

      map[row.ama].rows.push(row);
    });

    return Object.values(map).map((item: any) => ({
      ...item,

      missions: Array.from(item.missions),

      pilots: Array.from(item.pilots),
    }));
  }, [rows]);

  const hasUnmappedPilot = groupedPilots.some((pilotName) => {
    const selected = pilotMapping[pilotName];

    if (selected === undefined || selected === null) {
      return true;
    }

    if (selected === -1 && !newPilotMapping[pilotName]) {
      return true;
    }

    return false;
  });

  const hasUnmappedAma = groupedAma.some(
    (group: any) => !amaMapping[group.ama]?.id
  );

  const disableUpload =
    rows.length === 0 ||
    invalidRows.length > 0 ||
    loading ||
    hasUnmappedPilot ||
    hasUnmappedAma;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <div className="fixed top-0 left-0 z-[999] flex h-[92px] w-full items-center justify-between border-b bg-white/90 px-8 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <FileSpreadsheet className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold">CSV Preview</h1>

            <p className="text-lg text-gray-500">Review before upload</p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="rounded-2xl border bg-white px-6 py-3 font-semibold transition hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="space-y-8 px-8 pt-[125px] pb-10">
        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className="grid grid-cols-4 gap-6">
          <StatsCard title="TOTAL ROWS" value={rows.length} />

          <StatsCard
            title="TOTAL MISSIONS"
            value={[...new Set(rows.map((r) => r.mission_name))].length}
          />

          <StatsCard title="AMA FOUND" value={groupedAma.length} />

          <StatsCard title="TOTAL DURATION" value={`${totalDuration} min`} />
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold">AMA Mapping</h1>

            <p className="mt-2 text-sm text-gray-500">
              Match CSV AMA with Database AMA
            </p>

            <div className="mt-6 space-y-4">
              {groupedAma.map((group: any) => (
                <div key={group.ama} className="rounded-2xl border p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{group.ama}</h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {group.totalFlights} Flights
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {(group.missions || []).map((mission: string) => (
                          <span
                            key={mission}
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                          >
                            {mission}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setExpandedAma(
                          expandedAma === group.ama ? null : group.ama
                        )
                      }
                      className="rounded-xl border px-4 py-2 text-sm"
                    >
                      View Flights
                    </button>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    {/* MAP */}
                    <div className="overflow-hidden rounded-2xl border">
                      <MapContainer
                        center={[-2.5, 118]}
                        zoom={5}
                        style={{
                          height: "280px",
                          width: "100%",
                        }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {amas.map((ama: any) => (
                          <CircleMarker
                            key={ama.id}
                            center={[Number(ama.lat), Number(ama.lng)]}
                            radius={selectedMapAma?.id === ama.id ? 16 : 10}
                            pathOptions={{
                              color:
                                selectedMapAma?.id === ama.id
                                  ? "#2563eb"
                                  : "white",

                              weight: selectedMapAma?.id === ama.id ? 4 : 3,

                              fillColor:
                                ama.status === "SUCCESS"
                                  ? "#22c55e"
                                  : ama.status === "ON_PROGRESS"
                                    ? "#0ea5e9"
                                    : ama.status === "NEXT"
                                      ? "#f97316"
                                      : "#eab308",

                              fillOpacity: 1,
                            }}
                            eventHandlers={{
                              click: () => {
                                setSelectedMapAma(ama);

                                setAmaMapping({
                                  ...amaMapping,
                                  [group.ama]: ama,
                                });
                              },
                            }}
                          >
                            <Tooltip
                              permanent
                              direction="top"
                              offset={[0, -12]}
                              opacity={1}
                              interactive={false}
                            >
                              <div className="rounded-lg bg-white px-2 py-1 text-xs font-bold shadow">
                                {ama.ama}
                              </div>
                            </Tooltip>

                            <Popup>
                              <div className="w-[220px]">
                                <h1 className="font-bold text-slate-900">
                                  {ama.ama}
                                </h1>

                                <p className="mt-1 text-xs text-slate-500">
                                  AMA Monitoring Point
                                </p>

                                <div className="mt-4 space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Status</span>

                                    <span className="font-semibold">
                                      {ama.status}
                                    </span>
                                  </div>

                                  <div className="flex justify-between">
                                    <span>Latitude</span>

                                    <span>{Number(ama.lat).toFixed(5)}</span>
                                  </div>

                                  <div className="flex justify-between">
                                    <span>Longitude</span>

                                    <span>{Number(ama.lng).toFixed(5)}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedMapAma(ama);

                                    setAmaMapping({
                                      ...amaMapping,
                                      [group.ama]: ama,
                                    });
                                  }}
                                  className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white"
                                >
                                  Select AMA
                                </button>
                              </div>
                            </Popup>
                          </CircleMarker>
                        ))}
                      </MapContainer>
                    </div>

                    {/* SELECTED AMA */}
                    <div className="rounded-[28px] border bg-white p-5 shadow-sm">
                      {/* HEADER */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase">
                            Selected AMA
                          </p>

                          <h1 className="mt-2 text-2xl font-bold text-slate-900">
                            {amaMapping[group.ama]?.ama || "-"}
                          </h1>

                          <p className="mt-1 text-sm text-slate-500">
                            Location selected from map
                          </p>
                        </div>

                        <div className="rounded-2xl bg-blue-100 p-3">
                          <MapPinned className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>

                      {/* STATUS */}
                      {amaMapping[group.ama] && (
                        <div className="mt-5">
                          <div
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-sm ${
                              amaMapping[group.ama].status === "SUCCESS"
                                ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                : amaMapping[group.ama].status === "ONGOING"
                                  ? "bg-sky-100 text-sky-800 ring-1 ring-sky-200"
                                  : amaMapping[group.ama].status === "NEXT"
                                    ? "bg-orange-100 text-orange-800 ring-1 ring-orange-200"
                                    : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200"
                            }`}
                          >
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                amaMapping[group.ama].status === "SUCCESS"
                                  ? "bg-green-500"
                                  : amaMapping[group.ama].status === "ONGOING"
                                    ? "bg-sky-500"
                                    : amaMapping[group.ama].status === "NEXT"
                                      ? "bg-orange-500"
                                      : "bg-yellow-500"
                              }`}
                            />

                            {amaMapping[group.ama].status}
                          </div>
                        </div>
                      )}

                      {/* COORDINATE */}
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">Latitude</p>

                          <h1 className="mt-2 font-bold text-slate-900">
                            {amaMapping[group.ama]?.lat
                              ? Number(amaMapping[group.ama].lat).toFixed(6)
                              : "-"}
                          </h1>
                        </div>

                        <div className="rounded-2xl border bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">Longitude</p>

                          <h1 className="mt-2 font-bold text-slate-900">
                            {amaMapping[group.ama]?.lng
                              ? Number(amaMapping[group.ama].lng).toFixed(6)
                              : "-"}
                          </h1>
                        </div>
                      </div>

                      {/* SUMMARY */}
                      <div className="mt-4 rounded-2xl bg-blue-50 p-4">
                        <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                          Mapping Summary
                        </p>

                        <p className="mt-2 text-sm text-blue-800">
                          CSV AMA <strong>{group.ama}</strong> will be linked to
                          database AMA{" "}
                          <strong>
                            {amaMapping[group.ama]?.ama_name || "-"}
                          </strong>
                        </p>
                      </div>

                      {/* ACTION */}
                      <button
                        type="button"
                        disabled={!selectedMapAma}
                        onClick={() =>
                          setAmaMapping({
                            ...amaMapping,
                            [group.ama]: selectedMapAma,
                          })
                        }
                        className="mt-5 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-300"
                      >
                        Assign Selected AMA
                      </button>
                    </div>
                  </div>

                  {expandedAma === group.ama && (
                    <div className="mt-6 overflow-x-auto rounded-2xl border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="px-4 py-3 text-left">Mission</th>

                            <th className="px-4 py-3 text-left">Sequence</th>
                            <th className="px-4 py-3 text-left">Pilot</th>

                            <th className="px-4 py-3 text-left">UAV</th>

                            <th className="px-4 py-3 text-left">Duration</th>
                          </tr>
                        </thead>

                        <tbody>
                          {group.rows.map((row: CSVRow, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-3">{row.mission_name}</td>

                              <td className="px-4 py-3 font-medium">
                                #{index + 1}
                              </td>

                              <td className="px-4 py-3">{row.pilot}</td>

                              <td className="px-4 py-3">{row.uav_unit}</td>

                              <td className="px-4 py-3">
                                {row.duration_min} min
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold">Pilot Mapping</h1>

            <p className="mt-2 text-sm text-gray-500">
              Match CSV Pilot with Database Pilot
            </p>

            <div className="mt-6 space-y-4">
              {groupedPilots.map((pilotName: string) => (
                <div
                  key={pilotName}
                  className="grid grid-cols-1 gap-4 rounded-2xl border p-4 md:grid-cols-2"
                >
                  <div>
                    <p className="text-sm text-gray-500">CSV Pilot</p>

                    <h2 className="font-bold">{pilotName}</h2>
                  </div>

                  <div>
                    <select
                      value={pilotMapping[pilotName] || ""}
                      onChange={(e) =>
                        setPilotMapping({
                          ...pilotMapping,

                          [pilotName]: Number(e.target.value),
                        })
                      }
                      className="h-[54px] w-full rounded-2xl border px-4"
                    >
                      <option value="">Select Pilot</option>

                      {pilots.map((pilot: any, index: number) => (
                        <option
                          key={`pilot-${pilot.id}-${index}`}
                          value={pilot.id}
                        >
                          {pilot.pilot_name}
                        </option>
                      ))}

                      <option value="-1">+ Create New Pilot</option>
                    </select>

                    {pilotMapping[pilotName] === -1 && (
                      <input
                        type="text"
                        placeholder="New Pilot Name"
                        value={newPilotMapping[pilotName] || ""}
                        onChange={(e) =>
                          setNewPilotMapping({
                            ...newPilotMapping,

                            [pilotName]: e.target.value,
                          })
                        }
                        className="mt-3 h-[54px] w-full rounded-2xl border px-4"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sticky bottom-6 z-50 flex justify-end">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <h3 className="font-semibold text-blue-800">
                Auto Generated Flight ID
              </h3>

              <p className="mt-1 text-sm text-blue-700">
                Flight IDs are generated automatically by the system during
                upload. You do not need to include a flight_id column in the CSV
                file.
              </p>
            </div>
            {hasUnmappedAma && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="font-medium text-orange-700">
                  Some AMA locations have not been mapped.
                </p>
              </div>
            )}

            {hasUnmappedPilot && (
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <p className="font-medium text-orange-700">
                  Some pilots have not been mapped.
                </p>
              </div>
            )}
            <button
              // disabled={disableUpload}
              onClick={handleUpload}
              className="flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Upload className="h-5 w-5" />

              {loading ? "Uploading..." : `Upload ${rows.length} Flights`}
            </button>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  modalType === "success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <AlertCircle
                  className={`h-6 w-6 ${
                    modalType === "success" ? "text-green-600" : "text-red-600"
                  }`}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold">{modalTitle}</h2>

                <p className="mt-2 text-sm text-gray-500">{modalMessage}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);

                  if (modalType === "success") {
                    localStorage.removeItem("csv-preview");

                    router.replace("/");
                  }
                }}
                className={`rounded-2xl px-5 py-3 font-semibold text-white ${
                  modalType === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// STATS CARD
// =====================================================

function StatsCard({
  title,
  value,
  danger,
}: {
  title: string;

  value: string | number;

  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-[32px] border bg-white p-8 shadow-sm ${
        danger ? "border-red-300" : ""
      }`}
    >
      <p className="text-sm tracking-wide text-gray-500 uppercase">{title}</p>

      <h1
        className={`mt-5 text-4xl font-bold break-words ${
          danger ? "text-red-600" : ""
        }`}
      >
        {value}
      </h1>
    </div>
  );
}
