"use client";

import dynamic from "next/dynamic";

import { Loader2, Plus, X } from "lucide-react";

import useAddFlightForm from "@/hooks/useAddFlightForm";

import FlightFormSection from "../flight-form-section";

import FlightInput from "../flight-input";

import BatterySelect from "../forms/battery-select";

import useAmaOptions from "@/hooks/useAmaOptions";

// =====================================================
// DYNAMIC MAP
// =====================================================

const AmaPickerMap = dynamic(() => import("../../maps/ama-picker-map"), {
  ssr: false,
});

type Props = {
  mission: string;

  open: boolean;

  onClose: () => void;
};

export default function AddFlightModal({ mission, open, onClose }: Props) {
  // =====================================================
  // AMA OPTIONS
  // =====================================================

  const { amas } = useAmaOptions();

  // =====================================================
  // FORM
  // =====================================================

  const { form, setForm, errors, loading, isValid, handleSubmit } =
    useAddFlightForm(mission, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div className="flex h-[92vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="border-b px-8 py-6">
          <div className="flex items-start justify-between">
            {/* LEFT */}
            <div className="flex items-start gap-5">
              {/* ICON */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>

              {/* TITLE */}
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
                  Flight Management
                </p>

                <h1 className="mt-2 text-4xl font-bold tracking-tight">
                  New Flight Log
                </h1>

                {/* MISSION */}
                {mission ? (
                  <div className="mt-3 inline-flex rounded-full bg-blue-50 px-4 py-2">
                    <span className="text-sm font-semibold text-blue-700">
                      {mission}
                    </span>
                  </div>
                ) : (
                  <div className="mt-4 w-[320px]">
                    <FlightInput
                      label="Mission Name"
                      value={form.mission_name || ""}
                      error={errors.mission_name}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          mission_name: value,
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-7">
            {/* ================================================= */}
            {/* FLIGHT INFORMATION */}
            {/* ================================================= */}

            <FlightFormSection title="Flight Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* DATE */}
                <FlightInput
                  label="Flight Date"
                  type="date"
                  value={form.flight_date}
                  error={errors.flight_date}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      flight_date: value,
                    })
                  }
                />

                {/* FLIGHT ID */}
                <FlightInput
                  label="Flight ID"
                  value={form.flight_id}
                  error={errors.flight_id}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      flight_id: value,
                    })
                  }
                />

                {/* ================================================= */}
                {/* AMA DROPDOWN */}
                {/* ================================================= */}

                <div>
                  <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
                    AMA
                  </label>

                  <select
                    value={form.ama_id || ""}
                    onChange={(e) => {
                      const selectedAma = amas.find(
                        (item: any) => item.id === Number(e.target.value)
                      );

                      setForm({
                        ...form,

                        ama_id: Number(e.target.value),

                        ama: selectedAma?.ama_name || "",
                      });
                    }}
                    className={`h-[64px] w-full rounded-2xl border bg-gray-50 px-5 text-lg outline-none ${
                      errors.ama ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select AMA</option>

                    {amas.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.ama_name}
                      </option>
                    ))}
                  </select>

                  {/* ERROR */}
                  {errors.ama && (
                    <p className="mt-2 text-sm text-red-500">{errors.ama}</p>
                  )}
                </div>

                {/* ESTATE */}
                <FlightInput
                  label="Estate"
                  value={form.estate}
                  error={errors.estate}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      estate: value,
                    })
                  }
                />

                {/* ================================================= */}
                {/* MAP PICKER */}
                {/* ================================================= */}

                <div className="md:col-span-2">
                  <AmaPickerMap
                    selectedAmaId={form.ama_id}
                    onSelect={(ama: any) => {
                      setForm({
                        ...form,

                        ama_id: ama.id,

                        ama: ama.ama_name,
                      });
                    }}
                  />
                </div>

                {/* PILOT */}
                <FlightInput
                  label="Pilot"
                  value={form.pilot}
                  error={errors.pilot}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      pilot: value,
                    })
                  }
                />
              </div>
            </FlightFormSection>

            {/* ================================================= */}
            {/* BATTERY */}
            {/* ================================================= */}

            <FlightFormSection title="Battery Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FlightInput
                  label="Battery ID"
                  value={form.battery_id}
                  error={errors.battery_id}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      battery_id: value,
                    })
                  }
                />

                <FlightInput
                  label="Battery ID 2"
                  value={form.battery_id_2}
                  error={errors.battery_id_2}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      battery_id_2: value,
                    })
                  }
                />

                <BatterySelect
                  label="Battery Color"
                  value={form.battery_color}
                  error={errors.battery_color}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      battery_color: value,
                    })
                  }
                />

                <FlightInput
                  label="Start Percent"
                  type="number"
                  value={form.start_percent}
                  error={errors.start_percent}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      start_percent: value,
                    })
                  }
                />

                <FlightInput
                  label="End Percent"
                  type="number"
                  value={form.end_percent}
                  error={errors.end_percent}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      end_percent: value,
                    })
                  }
                />

                <FlightInput
                  label="Start Volt"
                  type="number"
                  value={form.start_volt}
                  error={errors.start_volt}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      start_volt: value,
                    })
                  }
                />

                <FlightInput
                  label="End Volt"
                  type="number"
                  value={form.end_volt}
                  error={errors.end_volt}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      end_volt: value,
                    })
                  }
                />
              </div>
            </FlightFormSection>

            {/* ================================================= */}
            {/* TIME */}
            {/* ================================================= */}

            <FlightFormSection title="Flight Time">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FlightInput
                  label="Start Time"
                  type="time"
                  value={form.start_time}
                  error={errors.start_time}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      start_time: value,
                    })
                  }
                />

                <FlightInput
                  label="End Time"
                  type="time"
                  value={form.end_time}
                  error={errors.end_time}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      end_time: value,
                    })
                  }
                />

                <FlightInput
                  label="Duration (min)"
                  type="number"
                  value={form.duration_min}
                  error={errors.duration_min}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      duration_min: value,
                    })
                  }
                />
              </div>
            </FlightFormSection>

            {/* ================================================= */}
            {/* NOTES */}
            {/* ================================================= */}

            <FlightFormSection title="Additional Notes">
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-gray-50 p-5 text-base transition outline-none focus:border-blue-500"
                placeholder="Write additional notes..."
              />
            </FlightFormSection>
          </div>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-8 py-5">
          {/* INFO */}
          <div>
            <p className="text-sm text-gray-500">
              Fill all required fields before saving
            </p>
          </div>

          {/* ACTION */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="rounded-2xl border px-6 py-3 font-medium transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={!isValid || loading}
              onClick={handleSubmit}
              className={`flex min-w-[180px] items-center justify-center gap-3 rounded-2xl px-7 py-3 font-semibold text-white transition ${
                !isValid || loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-black hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Save Flight
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
