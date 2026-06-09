"use client";

import { Check, Loader2, RadioTower, Save, X } from "lucide-react";

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

  if (!open) return null;

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  async function handleUpdate(item: any, status: string) {
    try {
      setLoadingId(item.id);

      const response = await fetch(`/api/amas/${item.id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed update status");

        return;
      }

      // SUCCESS
      toast.success(`${item.ama} updated to ${status}`);

      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  // =====================================================
  // COLOR
  // =====================================================

  function getStatusStyle(status: string) {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return {
          badge: "bg-green-100 text-green-700",

          border: "border-green-200",

          button: "bg-green-600 hover:bg-green-700",
        };

      case "ONGOING":
        return {
          badge: "bg-yellow-100 text-yellow-700",

          border: "border-yellow-200",

          button: "bg-yellow-500 hover:bg-yellow-600",
        };

      default:
        return {
          badge: "bg-red-100 text-red-700",

          border: "border-red-200",

          button: "bg-red-600 hover:bg-red-700",
        };
    }
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="w-full max-w-[760px] overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-7 py-6">
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
                Update monitoring condition
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
        <div className="max-h-[560px] overflow-y-auto p-6">
          <div className="space-y-4">
            {amaPoints.map((item: any) => {
              const style = getStatusStyle(item.status);

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border bg-white p-5 transition hover:shadow-md ${style.border}`}
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">
                    {/* LEFT */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold">{item.ama}</h1>

                        <div
                          className={`rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}
                        >
                          {item.status}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>{item.total_flights} Flights</span>

                        <span>{item.total_missions} Missions</span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                      {/* SELECT */}
                      <select
                        defaultValue={item.status}
                        onChange={(e) => handleUpdate(item, e.target.value)}
                        className="h-[52px] rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold transition outline-none focus:border-blue-500"
                      >
                        <option value="PENDING">PENDING</option>

                        <option value="ONGOING">ONGOING</option>

                        <option value="SUCCESS">SUCCESS</option>
                      </select>

                      {/* SAVE */}
                      <button
                        onClick={() => handleUpdate(item, item.status)}
                        className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl text-white transition ${style.button}`}
                      >
                        {loadingId === item.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Save className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* MISSIONS */}
                  {item.missions?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.missions.map((mission: string, index: number) => (
                        <div
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                        >
                          {mission}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t px-7 py-5">
          <p className="text-sm text-gray-500">
            Click dropdown to change AMA monitoring status
          </p>

          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-2xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            <Check className="h-4 w-4" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
