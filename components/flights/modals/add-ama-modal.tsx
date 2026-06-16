"use client";

import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { useState } from "react";

import { MapPin, Plus, X } from "lucide-react";

import MapClickHandler from "../../maps/map-click-handler";

import { toast } from "sonner";

type Props = {
  open: boolean;

  onClose: () => void;

  onSuccess: () => void;
};

export default function AddAmaModal({ open, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    ama_name: "",

    status: "WAITING",

    latitude: "",

    longitude: "",

    planning_date: "",

    actual_date: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // =====================================================
  // SAVE
  // =====================================================

  async function handleSave() {
    try {
      setLoading(true);
      console.log(form);

      const response = await fetch("/api/amas", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed add AMA");

        return;
      }

      // SUCCESS
      toast.success("AMA added successfully");

      onSuccess();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="w-full max-w-[1000px] overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">
              AMA MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold">Add New AMA</h1>

            <p className="mt-1 text-sm text-gray-500">
              Create drone monitoring point
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[380px_1fr]">
          {/* LEFT */}
          <div className="space-y-5">
            {/* AMA NAME */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                AMA Name
              </label>

              <input
                value={form.ama_name}
                onChange={(e) =>
                  setForm({
                    ...form,

                    ama_name: e.target.value,
                  })
                }
                placeholder="Input AMA name..."
                className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-base transition outline-none focus:border-blue-500"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,

                    status: e.target.value,
                  })
                }
                className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-base transition outline-none focus:border-blue-500"
              >
                <option value="WAITING">WAITING</option>

                <option value="NEXT">NEXT</option>

                <option value="ONGOING">ONGOING</option>

                <option value="SUCCESS">SUCCESS</option>
              </select>
            </div>

            {/* DATE */}
            <div className="grid grid-cols-2 gap-4">
              {/* PLANNING */}
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                  Planning Date
                </label>

                <input
                  type="date"
                  value={form.planning_date}
                  onChange={(e) =>
                    setForm({
                      ...form,

                      planning_date: e.target.value,
                    })
                  }
                  className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm transition outline-none focus:border-blue-500"
                />
              </div>

              {/* ACTUAL */}
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                  Actual Date
                </label>

                <input
                  type="date"
                  value={form.actual_date}
                  onChange={(e) =>
                    setForm({
                      ...form,

                      actual_date: e.target.value,
                    })
                  }
                  className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm transition outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* LAT LNG */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                  Latitude
                </label>

                <input
                  type="number"
                  step="0.000001"
                  value={form.latitude}
                  placeholder="-2.123456"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      latitude: e.target.value,
                    })
                  }
                  className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm transition outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                  Longitude
                </label>

                <input
                  type="number"
                  step="0.000001"
                  value={form.longitude}
                  placeholder="120.123456"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      longitude: e.target.value,
                    })
                  }
                  className="h-[58px] w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm transition outline-none focus:border-cyan-500"
                />
              </div>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-cyan-600" />

                  <div>
                    <h3 className="font-semibold text-cyan-700">
                      Coordinate Input
                    </h3>

                    <p className="mt-1 text-sm text-cyan-600">
                      You can manually enter latitude and longitude, or click
                      directly on the map to automatically fill the coordinates.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition((position) => {
                    setForm({
                      ...form,
                      latitude: position.coords.latitude.toFixed(6),
                      longitude: position.coords.longitude.toFixed(6),
                    });
                  });
                }}
                className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-100"
              >
                📍 Use Current Location
              </button>
            </div>

            {/* INFO */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-blue-700">Pick Location</h3>

                  <p className="mt-1 text-sm text-blue-600">
                    Click on map to set AMA coordinate location
                  </p>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={
                loading ||
                !form.ama_name ||
                !form.latitude ||
                !form.planning_date
              }
              onClick={handleSave}
              className="flex h-[58px] w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />

              {loading ? "Saving..." : "Save AMA"}
            </button>
          </div>

          {/* RIGHT */}
          <div className="overflow-hidden rounded-[28px] border">
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              className="h-[500px] w-full"
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                attribution="Google Satellite"
              />

              <MapClickHandler
                onPick={(lat, lng) =>
                  setForm({
                    ...form,

                    latitude: lat.toFixed(6),

                    longitude: lng.toFixed(6),
                  })
                }
              />

              {form.latitude && form.longitude && (
                <Marker
                  position={[Number(form.latitude), Number(form.longitude)]}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
