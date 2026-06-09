"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

import { AlertCircle, FileSpreadsheet, Upload } from "lucide-react";

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

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// =====================================================
// TYPES
// =====================================================

type CSVRow = {
  flight_date: string;

  flight_id: string;

  pilot: string;

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

  const [amas, setAmas] = useState<any[]>([]);

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
  // FETCH DATA
  // =====================================================

  useEffect(() => {
    async function fetchData() {
      try {
        // MISSION
        const missionRes = await fetch("/api/missions");

        const missionData = await missionRes.json();

        setMissions(missionData);

        // AMA
        const amaRes = await fetch("/api/maps/ama");

        const amaData = await amaRes.json();

        setAmas(amaData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  // =====================================================
  // VALIDATION
  // =====================================================

  const invalidRows = useMemo(() => {
    return rows.filter(
      (row) => !row.flight_date || !row.flight_id || !row.battery_id
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

  const disableUpload =
    invalidRows.length > 0 || loading || !selectedMission || !selectedAma;

  // =====================================================
  // HANDLE UPLOAD
  // =====================================================

  async function handleUpload() {
    try {
      setLoading(true);

      const payload = rows.map((item) => ({
        ...item,

        mission_name: selectedMission,

        ama_id: selectedAma.id,

        ama: selectedAma.ama,
      }));

      const res = await fetch("/api/upload-json", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await res.json();

      alert(result.message);

      localStorage.removeItem("csv-preview");

      router.push("/");
    } catch (err) {
      console.error(err);

      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

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
            title="MISSION"
            value={selectedMission || "Not Selected"}
            danger={!selectedMission}
          />

          <StatsCard title="TOTAL DURATION" value={`${totalDuration} min`} />

          <StatsCard
            title="SELECTED AMA"
            value={selectedAma ? selectedAma.ama : "Not Selected"}
            danger={!selectedAma}
          />
        </div>

        {/* ================================================= */}
        {/* WARNING */}
        {/* ================================================= */}

        {invalidRows.length > 0 && (
          <div className="flex items-center gap-3 rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
            <AlertCircle className="h-5 w-5" />

            <p>Some rows are invalid. Please fix the CSV file before upload.</p>
          </div>
        )}

        {/* ================================================= */}
        {/* MISSION */}
        {/* ================================================= */}

        <div className="rounded-[32px] border bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">
                Mission Configuration
              </p>

              <h1 className="mt-3 text-2xl font-bold">Select Mission</h1>

              <p className="mt-1 text-sm text-gray-500">
                Prevent duplicate mission naming
              </p>
            </div>

            {/* SELECT */}
            <div className="w-[360px]">
              {!isNewMission ? (
                <select
                  value={selectedMission}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setIsNewMission(true);

                      setSelectedMission("");

                      return;
                    }

                    setSelectedMission(e.target.value);
                  }}
                  className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 transition outline-none focus:border-blue-500"
                >
                  <option value="">Select Mission</option>

                  {missions.map((item: any, index: number) => (
                    <option key={index} value={item.mission_name}>
                      {item.mission_name}
                    </option>
                  ))}

                  <option value="__new__">+ Create New Mission</option>
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    value={selectedMission}
                    onChange={(e) =>
                      setSelectedMission(e.target.value.toUpperCase())
                    }
                    placeholder="Input new mission..."
                    className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 transition outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={() => {
                      setIsNewMission(false);

                      setSelectedMission("");
                    }}
                    className="text-sm font-semibold text-blue-600"
                  >
                    ← Back to existing mission
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* AMA MAP */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          {/* HEADER */}
          <div className="border-b px-7 py-6">
            <p className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">
              AMA Configuration
            </p>

            <h1 className="mt-3 text-2xl font-bold">Pick AMA Point</h1>

            <p className="mt-1 text-sm text-gray-500">
              Select exact AMA location from map
            </p>
          </div>

          {/* MAP */}
          <div className="relative">
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              className="h-[500px] w-full"
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                attribution="Google Satellite"
              />

              {amas.map((item: any) => {
                const isSelected = selectedAma?.id === item.id;

                return (
                  <CircleMarker
                    key={item.id}
                    center={[Number(item.lat), Number(item.lng)]}
                    radius={isSelected ? 12 : 8}
                    pathOptions={{
                      color:
                        item.status === "SUCCESS"
                          ? "#22c55e"
                          : item.status === "ONGOING"
                            ? "#f59e0b"
                            : "#ef4444",

                      fillColor:
                        item.status === "SUCCESS"
                          ? "#22c55e"
                          : item.status === "ONGOING"
                            ? "#f59e0b"
                            : "#ef4444",

                      fillOpacity: 1,
                    }}
                    eventHandlers={{
                      click: () => setSelectedAma(item),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[220px]">
                        <h1 className="text-lg font-bold">{item.ama}</h1>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.total_flights} flights
                        </p>

                        <div className="mt-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              item.status === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : item.status === "ONGOING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedAma(item)}
                          className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
                        >
                          Select AMA
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-5 text-left">DATE</th>

                  <th className="p-5 text-left">FLIGHT ID</th>

                  <th className="p-5 text-left">PILOT</th>

                  <th className="p-5 text-left">BATTERY</th>

                  <th className="p-5 text-left">COLOR</th>

                  <th className="p-5 text-left">DURATION</th>

                  <th className="p-5 text-left">NOTES</th>

                  <th className="p-5 text-left">STATUS</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item, index) => {
                  const invalid =
                    !item.flight_date || !item.flight_id || !item.battery_id;

                  return (
                    <tr
                      key={index}
                      className={`border-b ${
                        invalid ? "bg-red-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-5">{item.flight_date}</td>

                      <td className="p-5">
                        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
                          {item.flight_id}
                        </span>
                      </td>

                      <td className="p-5 font-semibold text-blue-600">
                        {item.pilot}
                      </td>

                      <td className="p-5">{item.battery_id}</td>

                      <td className="p-5">{item.battery_color}</td>

                      <td className="p-5">
                        <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
                          {item.duration_min} min
                        </span>
                      </td>

                      <td className="p-5">{item.notes}</td>

                      <td className="p-5">
                        {invalid ? (
                          <span className="rounded-full bg-red-100 px-4 py-1 text-sm text-red-700">
                            Invalid
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
                            Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================= */}
        {/* ACTION */}
        {/* ================================================= */}

        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-2xl border bg-white px-6 py-4 font-semibold transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={disableUpload}
            onClick={handleUpload}
            className={`flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold text-white transition ${
              disableUpload
                ? "cursor-not-allowed bg-gray-300"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            <Upload className="h-5 w-5" />

            {loading
              ? "Uploading..."
              : !selectedMission
                ? "Select Mission First"
                : !selectedAma
                  ? "Select AMA First"
                  : "Upload CSV"}
          </button>
        </div>
      </div>
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
