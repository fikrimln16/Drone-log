"use client";

import { Calendar, Clock3, MapPinned, Building2 } from "lucide-react";
import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

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

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-lg font-semibold text-slate-600">
              {data.mission_name}
            </p>

            <Link
              href={`/missions/${encodeURIComponent(data.mission_name)}`}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              View Mission
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AmaInfoCard ama={data.ama_name} status={data.status} />

        <InfoCard
          icon={<Building2 className="h-5 w-5 text-green-600" />}
          title="Estate"
          value={data.estate || "-"}
          bg="bg-green-100"
        />

        <InfoCard
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          title="Flight Date"
          value={new Date(data.flight_date).toLocaleDateString("id-ID")}
          bg="bg-purple-100"
        />

        <InfoCard
          icon={<Clock3 className="h-5 w-5 text-orange-600" />}
          title="Flight Time"
          value={`${data.start_time?.slice(0, 5)} → ${data.end_time?.slice(0, 5)}`}
          bg="bg-orange-100"
        />
      </div>
    </div>
  );
}

function AmaInfoCard({ ama, status }: { ama: string; status: string }) {
  const statusStyle =
    status === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : status === "ONGOING"
        ? "bg-sky-100 text-sky-700"
        : status === "NEXT"
          ? "bg-orange-100 text-orange-700"
          : "bg-yellow-100 text-yellow-700";

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <MapPinned className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              AMA
            </p>

            <h1 className="mt-1 font-bold text-slate-900">{ama || "-"}</h1>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusStyle}`}
        >
          {status}
        </span>
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
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
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
