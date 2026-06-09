"use client";

import { useRef } from "react";

import Papa from "papaparse";

import { useRouter } from "next/navigation";

import { Download, FileSpreadsheet, Upload, X } from "lucide-react";

type CSVRow = {
  flight_date: string;

  estate: string;

  pilot: string;

  flight_id: string;

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
      "estate",
      "pilot",
      "flight_id",
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
        "2026-07-01",
        "Estate Sierra",
        "ICAPY",
        "FLY101",
        "BAT101",
        "BAT102",
        "Blue",
        "100",
        "42",
        "25.40",
        "22.20",
        "07:15",
        "07:58",
        "43",
        "Morning thermal inspection",
      ],

      [
        "2026-07-01",
        "Estate Tango",
        "NANDA",
        "FLY102",
        "BAT103",
        "BAT104",
        "Black",
        "98",
        "37",
        "25.20",
        "21.90",
        "08:10",
        "08:49",
        "39",
        "Boundary area monitoring",
      ],

      [
        "2026-07-02",
        "Estate Victor",
        "RAHMAN",
        "FLY103",
        "BAT105",
        "BAT106",
        "Green",
        "100",
        "35",
        "25.50",
        "21.80",
        "09:00",
        "09:44",
        "44",
        "Tree density mapping",
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

      <div className="w-full max-w-[900px] rounded-[32px] bg-white p-8 shadow-2xl">
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

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* STEP 1 */}
          <div className="rounded-3xl border bg-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
              1
            </div>

            <h2 className="mt-5 text-lg font-bold">Upload CSV</h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Upload flight logs using the provided CSV template.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="rounded-3xl border bg-yellow-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 text-lg font-bold text-white">
              2
            </div>

            <h2 className="mt-5 text-lg font-bold">Select Mission</h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Mission will be selected after CSV upload to prevent duplicate
              mission names.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="rounded-3xl border bg-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-lg font-bold text-white">
              3
            </div>

            <h2 className="mt-5 text-lg font-bold">Pick AMA Point</h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              AMA location will be selected from the map after upload for
              accurate coordinates.
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
                Mission and AMA will be configured after CSV upload
              </p>
            </div>

            <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              15 Columns
            </div>
          </div>

          {/* COLUMNS */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "flight_date",
              "estate",
              "pilot",
              "flight_id",
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
