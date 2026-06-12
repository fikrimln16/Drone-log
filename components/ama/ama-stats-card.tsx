"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  trend?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
};

export default function AmaStatsCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  iconBg,
}: Props) {
  const isPositive = !trend || !trend.includes("-");

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* BACKGROUND ACCENT */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-50 opacity-60 blur-3xl" />

      {/* HEADER */}
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.35em] text-blue-600 uppercase">
            {title}
          </p>
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${iconBg || "bg-blue-100"} `}
          >
            {icon}
          </div>
        )}
      </div>

      {/* VALUE */}
      <div className="relative mt-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {value}
        </h1>
      </div>

      {/* FOOTER */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          {trend && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } `}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}

              {trend}
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-xs font-medium text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
