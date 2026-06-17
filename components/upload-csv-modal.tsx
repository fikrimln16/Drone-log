"use client";

import { useRef } from "react";

import Papa, { ParseResult } from "papaparse";
import { useRouter } from "next/navigation";

import { Download, FileSpreadsheet, Upload, X } from "lucide-react";

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

type Props = {
  open: boolean;

  onClose: () => void;
};

export default function UploadCSVModal({ open, onClose }: Props) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  // =====================================================
  // DOWNLOAD TEMPLATE
  // =====================================================

  function handleDownloadTemplate() {
    // HEADERS
    const headers = [
      "flight_date",
      "ama",
      "mission_name",
      "estate",
      "pilot",
      "uav_unit",
      "battery_id",
      "battery_id_2",
      "battery_color",
      "start_percent",
      "end_percent",
      "start_volt",
      "end_volt",
      "start_time",
      "end_time",
      "duration_min",
      "notes",
    ];

    // SAMPLE ROWS
    const rows = [
      [
        "07/02/2026",
        "CENGAL",
        "MISI6_CENGAL_SPLIT2",
        "-",
        "Theo_Rizki_Afifah",
        "W1",
        "4525A",
        "4525B",
        "UNGU",
        "100",
        "25",
        "32.44",
        "28.54",
        "10:17",
        "10:48",
        "31",
        "",
      ],

      [
        "07/02/2026",
        "CENGAL",
        "MISI6_CENGAL_SPLIT2",
        "-",
        "Theo_Rizki_Afifah",
        "W1",
        "6981A",
        "6981B",
        "KUNING",
        "100",
        "32",
        "32.53",
        "28.54",
        "10:51",
        "11:28",
        "37",
        "",
      ],
    ];

    // CSV FORMAT
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    // DOWNLOAD
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "DRONE_FLIGHT_TEMPLATE.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // =====================================================
  // CHOOSE FILE
  // =====================================================

  function handleChooseFile() {
    fileInputRef.current?.click();
  }

  // =====================================================
  // HANDLE FILE
  // =====================================================

  function handleFile(file: File) {
    Papa.parse(file, {
      header: true,

      skipEmptyLines: true,

      complete: (results: Papa.ParseResult<CSVRow>) => {
        localStorage.setItem("csv-preview", JSON.stringify(results.data));

        router.push("/preview-upload");
      },
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div className="max-h-[92vh] w-full max-w-[1100px] overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between">
          <div>
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold">Upload CSV Guide</h1>

            <p className="mt-3 text-gray-500">
              Please use the correct CSV format before uploading drone flight
              logs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================================================= */}
        {/* FLOW GUIDE */}
        {/* ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4">
          {/* STEP 1 */}
          <div className="rounded-3xl border bg-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
              1
            </div>

            <h2 className="mt-5 text-lg font-bold">Upload CSV</h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Import drone flight data using the provided CSV template.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="rounded-3xl border bg-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-lg font-bold text-white">
              2
            </div>

            <h2 className="mt-5 text-lg font-bold">Map AMA</h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Match CSV AMA names with AMA records stored in the system.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="rounded-3xl border bg-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-lg font-bold text-white">
              3
            </div>

            <h2 className="mt-5 text-lg font-bold">Map Pilots</h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Connect pilot names from CSV with existing pilot records or create
              new pilots.
            </p>
          </div>

          {/* STEP 4 */}
          <div className="rounded-3xl border bg-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-lg font-bold text-white">
              4
            </div>

            <h2 className="mt-5 text-lg font-bold">Review & Upload</h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Validate all data before importing flights into the database.
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* REQUIRED COLUMNS */}
        {/* ================================================= */}

        <div className="mt-8 rounded-2xl border bg-gray-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Required CSV Columns</h2>

              <p className="mt-1 text-sm text-gray-500">
                Mission names are imported directly from CSV. AMA and Pilot
                records will be mapped during the preview process.
              </p>
            </div>

            <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              17 Columns
            </div>
          </div>

          {/* COLUMNS */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "flight_date",
              "ama",
              "mission_name",
              "estate",
              "pilot",
              "uav_unit",
              "battery_id",
              "battery_id_2",
              "battery_color",
              "start_percent",
              "end_percent",
              "start_volt",
              "end_volt",
              "start_time",
              "end_time",
              "duration_min",
              "notes",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border bg-white px-4 py-3 text-sm font-medium"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <h3 className="font-bold text-yellow-800">Important Notes</h3>

          <ul className="mt-3 space-y-2 text-sm text-yellow-700">
            <li>
              • Flight ID is generated automatically by the system during
              upload.
            </li>

            <li>• Generated Flight ID example: C-MISI6_C_S2-20260207-001</li>

            <li>• Mission Name will be imported exactly as written in CSV.</li>

            <li>
              • AMA names from CSV must be mapped to existing AMA records.
            </li>

            <li>
              • Pilot names from CSV can be linked to existing pilots or create
              new pilot records.
            </li>

            <li>
              • Example: Pandu_Kris_Fikri will create 3 pilot assignments:
              Pandu, Kris, and Fikri.
            </li>

            <li>• Date format must use DD/MM/YYYY.</li>

            <li>• Time format must use HH:mm.</li>
          </ul>
        </div>
        {/* ================================================= */}
        {/* ACTION */}
        {/* ================================================= */}

        <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
          {/* DOWNLOAD */}
          <button
            onClick={handleDownloadTemplate}
            className="flex h-[56px] items-center justify-center gap-3 rounded-2xl border bg-white px-6 font-semibold transition hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
            Download Template
          </button>

          {/* CHOOSE FILE */}
          <button
            onClick={handleChooseFile}
            className="flex h-[56px] items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
          >
            <Upload className="h-5 w-5" />
            Choose CSV
          </button>
        </div>

        {/* ================================================= */}
        {/* INPUT */}
        {/* ================================================= */}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}
