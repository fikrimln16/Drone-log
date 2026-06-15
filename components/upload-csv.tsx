"use client";

import { useState } from "react";

import { FileSpreadsheet } from "lucide-react";

import UploadCSVModal from "./upload-csv-modal";

export default function UploadCSV() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-[64px] w-full flex-col items-center justify-center gap-1 rounded-2xl border bg-white px-3 shadow-sm transition hover:border-green-300 hover:bg-green-50 md:h-[54px] md:w-auto md:flex-row md:gap-3 md:px-5"
      >
        {/* ICON */}
        <div className="rounded-lg bg-green-100 p-2">
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
        </div>

        {/* DESKTOP */}
        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-black">Upload CSV</p>

          <p className="text-xs text-gray-500">Import drone flight logs</p>
        </div>

        {/* MOBILE */}
        <span className="text-center text-xs font-semibold md:hidden">
          Upload CSV
        </span>
      </button>

      <UploadCSVModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
