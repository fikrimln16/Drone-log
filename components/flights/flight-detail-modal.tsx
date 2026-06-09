"use client";

import dynamic from "next/dynamic";

import { X, MapPinned } from "lucide-react";

// =====================================================
// MAP
// =====================================================

const FlightDetailMap: any = dynamic(
  () => import("../maps/flight-detail-map"),
  {
    ssr: false,
  }
);

type Props = {
  data: any;

  onClose: () => void;
};

export default function FlightDetailModal({ data, onClose }: Props) {
  if (!data) return null;

  // =====================================================
  // STATUS COLOR
  // =====================================================

  const statusColor =
    data.status === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : data.status === "ONGOING"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div className="relative flex max-h-[94vh] w-full max-w-[1350px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="border-b px-8 py-7">
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

          {/* LABEL */}
          <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
            Flight Detail
          </p>

          <div className="mt-3 flex items-end justify-between">
            {/* LEFT */}
            <div>
              <h1 className="text-5xl font-bold tracking-tight">
                {data.flight_id}
              </h1>

              <p className="mt-2 text-gray-500">
                Complete drone flight information
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* STATUS */}
              <div
                className={`rounded-full px-5 py-2 text-sm font-bold ${statusColor}`}
              >
                {data.status || "PENDING"}
              </div>

              {/* MISSION */}
              <div className="rounded-2xl bg-blue-50 px-5 py-3">
                <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
                  Mission
                </p>

                <p className="mt-1 text-lg font-bold text-blue-700">
                  {data.mission_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {/* ================================================= */}
            {/* LEFT */}
            {/* ================================================= */}

            <div className="space-y-8">
              {/* FLIGHT INFO */}
              <Section title="Flight Information">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Item
                    label="Flight Date"
                    value={
                      data.flight_date
                        ? new Date(data.flight_date).toLocaleDateString("id-ID")
                        : "-"
                    }
                  />

                  <Item label="AMA" value={data.ama} />

                  <Item label="Estate" value={data.estate} />

                  <Item label="Pilot" value={data.pilot} />

                  <Item
                    label="Flight Duration"
                    value={`${data.duration_min || "-"} min`}
                  />
                </div>
              </Section>

              {/* BATTERY */}
              <Section title="Battery Information">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Item label="Battery ID" value={data.battery_id} />

                  <Item label="Battery ID 2" value={data.battery_id_2} />

                  <Item label="Battery Color" value={data.battery_color} />

                  <Item
                    label="Start Percent"
                    value={`${data.start_percent || "-"}%`}
                    variant="green"
                  />

                  <Item
                    label="End Percent"
                    value={`${data.end_percent || "-"}%`}
                    variant={
                      data.end_percent <= 20
                        ? "red"
                        : data.end_percent <= 50
                          ? "yellow"
                          : "green"
                    }
                  />

                  <Item
                    label="Start Volt"
                    value={`${data.start_volt || "-"}V`}
                  />

                  <Item label="End Volt" value={`${data.end_volt || "-"}V`} />
                </div>
              </Section>

              {/* TIME */}
              <Section title="Flight Time">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Item label="Start Time" value={data.start_time} />

                  <Item label="End Time" value={data.end_time} />
                </div>
              </Section>

              {/* NOTES */}
              <Section title="Notes">
                <div className="rounded-2xl border bg-gray-50 p-6">
                  <p className="text-base leading-relaxed text-gray-700">
                    {data.notes || "No additional notes"}
                  </p>
                </div>
              </Section>
            </div>

            {/* ================================================= */}
            {/* RIGHT */}
            {/* ================================================= */}

            <div className="space-y-6">
              {/* AMA INFO */}
              <div className="rounded-[32px] border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
                      AMA Information
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">{data.ama}</h1>

                    <p className="mt-2 text-gray-500">
                      Drone monitoring operational area
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-100 p-4">
                    <MapPinned className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-6">
                  <div
                    className={`inline-flex rounded-full px-5 py-2 text-sm font-bold ${statusColor}`}
                  >
                    {data.status || "PENDING"}
                  </div>
                </div>

                {/* COORD */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Latitude
                    </p>

                    <h1 className="mt-2 text-xl font-bold">
                      {data.latitude || "-"}
                    </h1>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-5">
                    <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                      Longitude
                    </p>

                    <h1 className="mt-2 text-xl font-bold">
                      {data.longitude || "-"}
                    </h1>
                  </div>
                </div>
              </div>

              {/* MAP */}
              <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
                <div className="border-b px-6 py-5">
                  <h1 className="text-2xl font-bold">AMA Location</h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Flight operation coordinate
                  </p>
                </div>

                <div className="h-[550px]">
                  <FlightDetailMap
                    lat={Number(data.latitude)}
                    lng={Number(data.longitude)}
                    ama={data.ama}
                    status={data.status}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// SECTION
// =====================================================

function Section({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500" />

        <h2 className="text-sm font-bold tracking-[0.25em] text-gray-500 uppercase">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

// =====================================================
// ITEM
// =====================================================

function Item({
  label,
  value,
  variant = "default",
}: {
  label: string;

  value: any;

  variant?: "default" | "green" | "yellow" | "red";
}) {
  const variantStyle = {
    default: "bg-gray-50 text-black",

    green: "bg-green-50 text-green-700",

    yellow: "bg-yellow-50 text-yellow-700",

    red: "bg-red-50 text-red-700",
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition hover:shadow-sm ${variantStyle[variant]}`}
    >
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>

      <p className="mt-3 text-xl font-bold break-words">{value || "-"}</p>
    </div>
  );
}
