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
  ama: string;
  mission_name: string;
  estate: string;
  flight_id: string;
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

  const [amas, setAmas] = useState<any[]>([]);

  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  const [pilots, setPilots] = useState<any[]>([]);

  const [pilotMapping, setPilotMapping] = useState<Record<string, number>>({});

  const [newPilotMapping, setNewPilotMapping] = useState<
    Record<string, string>
  >({});

  const [amaMapping, setAmaMapping] = useState<Record<string, number>>({});

  const [expandedAma, setExpandedAma] = useState<string | null>(null);

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

  // =====================================================
  // HANDLE UPLOAD
  // =====================================================

  async function handleUpload() {
    try {
      setLoading(true);

      const payload = rows.map((item) => {
        groupedAma.some((group: any) => !amaMapping[group.ama]);
        const amaId = amaMapping[item.ama];
        const amaData = amas.find((a) => a.id === amaId);

        return {
          ...item,

          mission_name: item.mission_name,

          ama_id: amaId,

          ama: amaData?.ama || "",

          pilot_id: pilotMapping[item.pilot],

          new_pilot_name:
            pilotMapping[item.pilot] === -1
              ? newPilotMapping[item.pilot]
              : null,
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

      alert(result.message || "Upload Success");

      localStorage.removeItem("csv-preview");

      router.push("/");
    } catch (error) {
      console.error(error);

      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  }

  const groupedPilots = useMemo(() => {
    return [...new Set(rows.map((item) => item.pilot))];
  }, [rows]);

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

      map[row.ama].pilots.add(row.pilot);

      map[row.ama].rows.push(row);
    });

    return Object.values(map).map((item: any) => ({
      ...item,

      missions: Array.from(item.missions || []),

      pilots: Array.from(item.pilots || []),
    }));
  }, [rows]);

  const disableUpload =
    invalidRows.length > 0 ||
    loading ||
    groupedPilots.some((pilotName) => !pilotMapping[pilotName]);

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

                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold">
                      Map AMA
                    </label>

                    <select
                      value={amaMapping[group.ama] || ""}
                      onChange={(e) =>
                        setAmaMapping({
                          ...amaMapping,

                          [group.ama]: Number(e.target.value),
                        })
                      }
                      className="h-[54px] w-full rounded-2xl border px-4"
                    >
                      <option value="">Select AMA</option>

                      {amas.map((ama: any) => (
                        <option key={ama.id} value={ama.id}>
                          {ama.ama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {expandedAma === group.ama && (
                    <div className="mt-6 overflow-x-auto rounded-2xl border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="px-4 py-3 text-left">Mission</th>

                            <th className="px-4 py-3 text-left">Flight</th>

                            <th className="px-4 py-3 text-left">Pilot</th>

                            <th className="px-4 py-3 text-left">UAV</th>

                            <th className="px-4 py-3 text-left">Duration</th>
                          </tr>
                        </thead>

                        <tbody>
                          {group.rows.map((row: CSVRow, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="px-4 py-3">{row.mission_name}</td>

                              <td className="px-4 py-3">{row.flight_id}</td>

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
            <button
              disabled={disableUpload}
              onClick={handleUpload}
              className="flex items-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Upload className="h-5 w-5" />

              {loading ? "Uploading..." : `Upload ${rows.length} Flights`}
            </button>
          </div>
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
