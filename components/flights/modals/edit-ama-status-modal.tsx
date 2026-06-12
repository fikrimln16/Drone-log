"use client";

import {
  CalendarDays,
  Check,
  Loader2,
  RadioTower,
  Save,
  X,
} from "lucide-react";

import { useState } from "react";

import { toast } from "sonner";

type Props = {
  open: boolean;

  onClose: () => void;

  amaPoints: any[];

  onSuccess: () => void;
};

export default function EditAmaStatusModal({
  open,
  onClose,
  amaPoints,
  onSuccess,
}: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<any>({});

  if (!open) return null;

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  function handleChange(id: number, field: string, value: string) {
    setFormData((prev: any) => ({
      ...prev,

      [id]: {
        ...prev[id],

        [field]: value,
      },
    }));
  }

  // =====================================================
  // UPDATE
  // =====================================================

  async function handleUpdate(item: any) {
    try {
      setLoadingId(item.id);

      const current = formData[item.id] || {};

      const payload = {
        status: current.status || item.status,

        planning_date: current.planning_date || item.planning_date,

        actual_date: current.actual_date || item.actual_date,
      };

      const response = await fetch(`/api/amas/${item.id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed update AMA");

        return;
      }

      toast.success(`${item.ama} updated`);

      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  // =====================================================
  // STYLE
  // =====================================================

  function getStatusStyle(status: string) {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return {
          badge: "bg-green-100 text-green-800 ring-1 ring-green-200",

          border: "border-green-200",

          button: "bg-green-600 hover:bg-green-700",
        };

      case "ONGOING":
        return {
          badge: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",

          border: "border-sky-200",

          button: "bg-sky-600 hover:bg-sky-700",
        };

      case "NEXT":
        return {
          badge: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",

          border: "border-orange-200",

          button: "bg-orange-600 hover:bg-orange-700",
        };

      case "WAITING":
        return {
          badge: "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",

          border: "border-yellow-200",

          button: "bg-yellow-600 hover:bg-yellow-700",
        };

      default:
        return {
          badge: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",

          border: "border-slate-200",

          button: "bg-slate-600 hover:bg-slate-700",
        };
    }
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="w-full max-w-[900px] overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-purple-100 p-4">
              <RadioTower className="h-6 w-6 text-purple-600" />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-gray-400 uppercase">
                AMA MANAGEMENT
              </p>

              <h1 className="mt-2 text-3xl font-bold">Edit AMA Status</h1>

              <p className="mt-1 text-sm text-gray-500">
                Update monitoring & scheduling information
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="space-y-5">
            {amaPoints.map((item: any) => {
              const current = formData[item.id] || {};

              const selectedStatus = current.status || item.status;

              const style = getStatusStyle(selectedStatus);

              return (
                <div
                  key={item.id}
                  className={`rounded-[28px] border bg-white p-6 transition hover:shadow-md ${style.border}`}
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-6">
                    {/* LEFT */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{item.ama}</h1>

                        <div
                          className={`rounded-full px-4 py-2 text-xs font-bold ${style.badge}`}
                        >
                          {selectedStatus === "SUCCESS"
                            ? "Completed"
                            : selectedStatus === "ONGOING"
                              ? "On Progress"
                              : selectedStatus === "NEXT"
                                ? "Next"
                                : "Waiting"}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-5 text-sm text-gray-500">
                        <span>{item.total_flights} Flights</span>

                        <span>
                          {item.latitude}, {item.longitude}
                        </span>
                      </div>

                      {/* DATE */}
                      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* PLANNING */}
                        <div className="rounded-2xl border bg-slate-50 p-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-blue-500" />

                            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              Planning Date
                            </p>
                          </div>

                          <input
                            type="date"
                            defaultValue={item.planning_date?.split("T")[0]}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                "planning_date",
                                e.target.value
                              )
                            }
                            className="mt-3 h-[52px] w-full rounded-2xl border bg-white px-4 outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* ACTUAL */}
                        <div className="rounded-2xl border bg-slate-50 p-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-purple-500" />

                            <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              Actual Date
                            </p>
                          </div>

                          <input
                            type="date"
                            disabled={selectedStatus === "WAITING"}
                            defaultValue={item.actual_date?.split("T")[0]}
                            onChange={(e) =>
                              handleChange(
                                item.id,
                                "actual_date",
                                e.target.value
                              )
                            }
                            className="mt-3 h-[52px] w-full rounded-2xl border bg-white px-4 outline-none focus:border-purple-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="w-[220px] space-y-4">
                      {/* STATUS */}
                      <div>
                        <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                          Monitoring Status
                        </p>

                        <select
                          defaultValue={item.status}
                          onChange={(e) =>
                            handleChange(item.id, "status", e.target.value)
                          }
                          className="h-[54px] w-full rounded-2xl border bg-gray-50 px-5 font-semibold outline-none focus:border-blue-500"
                        >
                          <option value="WAITING">WAITING</option>

                          <option value="NEXT">NEXT</option>

                          <option value="ONGOING">ONGOING</option>

                          <option value="SUCCESS">SUCCESS</option>
                        </select>
                      </div>

                      {/* SAVE */}
                      <button
                        onClick={() => handleUpdate(item)}
                        className={`flex h-[56px] w-full items-center justify-center gap-3 rounded-2xl font-semibold text-white transition ${style.button}`}
                      >
                        {loadingId === item.id ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            Save Update
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t px-8 py-5">
          <p className="text-sm text-gray-500">
            Update AMA operational scheduling and monitoring status
          </p>

          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            <Check className="h-4 w-4" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
