"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { Loader2, Pencil, X } from "lucide-react";

import useFlightForm from "@/hooks/useFlightForm";

import useEditFlight from "@/hooks/useEditFlight";

import FlightForm from "../forms/flight-form";

// =====================================================
// DYNAMIC MAP
// =====================================================

const AmaPickerMap: any = dynamic(() => import("../../maps/ama-picker-map"), {
  ssr: false,
});

type Props = {
  open: boolean;

  data: any;

  onClose: () => void;

  onSuccess: (updated: any) => void;
};

export default function EditFlightModal({
  open,
  data,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  // =====================================================
  // FORM
  // =====================================================

  const { form, setForm, errors, validate, isValid } = useFlightForm();

  const { handleUpdate } = useEditFlight();

  // =====================================================
  // SET DATA
  // =====================================================

  useEffect(() => {
    if (!data) return;

    setForm({
      flight_date: data.flight_date ? data.flight_date.split("T")[0] : "",

      ama: data.ama || "",

      ama_id: data.ama_id || "",

      estate: data.estate || "",

      pilot: data.pilot || "",

      flight_id: data.flight_id || "",

      mission_name: data.mission_name || "",

      battery_id: data.battery_id || "",

      battery_id_2: data.battery_id_2 || "",

      battery_color: data.battery_color || "",

      start_percent: data.start_percent || "",

      end_percent: data.end_percent || "",

      start_volt: data.start_volt || "",

      end_volt: data.end_volt || "",

      start_time: data.start_time ? data.start_time.slice(0, 5) : "",

      end_time: data.end_time ? data.end_time.slice(0, 5) : "",

      duration_min: data.duration_min || "",

      notes: data.notes || "",
    });
  }, [data, setForm]);

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div className="flex h-[92vh] w-full max-w-[1300px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex items-start justify-between border-b px-10 py-8">
          {/* LEFT */}
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Pencil className="h-8 w-8 text-blue-600" />
            </div>

            <h1 className="mt-5 text-5xl font-bold">Edit Flight</h1>

            <p className="mt-3 text-gray-500">Update flight information</p>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="flex h-14 w-14 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {/* ================================================= */}
            {/* LEFT SIDE */}
            {/* ================================================= */}

            <div className="space-y-6">
              {/* FORM */}
              <div className="rounded-[32px] border bg-white p-6 shadow-sm">
                <FlightForm
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  disableFlightId
                />
              </div>
            </div>

            {/* ================================================= */}
            {/* RIGHT SIDE */}
            {/* ================================================= */}

            <div className="space-y-6">
              {/* ================================================= */}
              {/* AMA INFORMATION */}
              {/* ================================================= */}

              <div className="rounded-[32px] border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
                      Selected AMA
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">
                      {form.ama || "No AMA Selected"}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                      Change AMA directly from map selection
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-100 p-4">
                    <Pencil className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* INFO */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {/* AMA ID */}
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      AMA ID
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                      {form.ama_id || "-"}
                    </h1>
                  </div>

                  {/* STATUS */}
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Selection
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-green-600">
                      ACTIVE
                    </h1>
                  </div>
                </div>

                {/* ALERT */}
                <div className="mt-5 rounded-2xl bg-blue-50 p-5">
                  <p className="text-sm leading-relaxed text-blue-700">
                    Click AMA point on the map to automatically change selected
                    AMA and coordinates.
                  </p>
                </div>
              </div>

              {/* ================================================= */}
              {/* MAP */}
              {/* ================================================= */}

              <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
                {/* HEADER */}
                <div className="border-b px-6 py-5">
                  <h1 className="text-2xl font-bold">AMA Location Picker</h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Select AMA directly from Indonesia map
                  </p>
                </div>

                {/* MAP */}
                <div className="h-[650px]">
                  <AmaPickerMap
                    selectedAmaId={Number(form.ama_id)}
                    onSelect={(ama: any) => {
                      // =================================================
                      // UPDATE FORM
                      // =================================================

                      setForm({
                        ...form,

                        ama_id: ama.id,

                        ama: ama.ama_name,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex justify-end gap-4 border-t px-10 py-6">
          {/* CANCEL */}
          <button
            onClick={onClose}
            className="rounded-2xl border px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          {/* SAVE */}
          <button
            disabled={!isValid || loading}
            onClick={() =>
              handleUpdate({
                id: data.id,

                form,

                validate,

                onClose,

                setLoading,

                onSuccess: (updated: any) =>
                  onSuccess({
                    ...data,
                    ...updated,
                  }),
              })
            }
            className="flex min-w-[200px] items-center justify-center gap-3 rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Pencil className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
