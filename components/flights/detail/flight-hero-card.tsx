"use client";

import { Calendar, Clock3, MapPinned, Plane } from "lucide-react";

type Props = {
  data: any;
};

export default function FlightHeroCard({ data }: Props) {
  const statusStyle =
    data?.status === "SUCCESS"
      ? {
          bg: "bg-green-100",
          text: "text-green-700",
          dot: "bg-green-500",
        }
      : data?.status === "ONGOING"
        ? {
            bg: "bg-sky-100",
            text: "text-sky-700",
            dot: "bg-sky-500",
          }
        : data?.status === "NEXT"
          ? {
              bg: "bg-orange-100",
              text: "text-orange-700",
              dot: "bg-orange-500",
            }
          : {
              bg: "bg-yellow-100",
              text: "text-yellow-700",
              dot: "bg-yellow-500",
            };

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-blue-600 uppercase">
            Flight Detail
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            {data.flight_id}
          </h1>

          <p className="mt-2 text-lg font-semibold text-slate-600">
            {data.mission_name}
          </p>
        </div>

        {/* STATUS */}
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${statusStyle.bg} ${statusStyle.text}`}
        >
          <div className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} />

          {data.status}
        </div>
      </div>

      {/* STATS */}
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<MapPinned className="h-5 w-5 text-blue-600" />}
          title="AMA"
          value={data.ama_name || "-"}
          bg="bg-blue-100"
        />

        <InfoCard
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          title="Flight Date"
          value={new Date(data.flight_date).toLocaleDateString("id-ID")}
          bg="bg-purple-100"
        />

        <InfoCard
          icon={<Clock3 className="h-5 w-5 text-orange-600" />}
          title="Duration"
          value={`${data.duration_min} Minutes`}
          bg="bg-orange-100"
        />

        <InfoCard
          icon={<Plane className="h-5 w-5 text-cyan-600" />}
          title="UAV Unit"
          value={data.uav_unit || "-"}
          bg="bg-cyan-100"
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  bg: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </p>

          <h1 className="mt-1 font-bold text-slate-900">{value}</h1>
        </div>
      </div>
    </div>
  );
}
