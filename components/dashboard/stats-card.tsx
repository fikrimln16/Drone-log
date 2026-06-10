"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Props = {
  title: string;

  value: string | number;

  trend?: string;

  subtitle?: string;

  icon?: React.ReactNode;

  iconBg?: string;
};

export default function StatsCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  iconBg = "bg-blue-100",
}: Props) {
  const isNegative = trend?.includes("-");

  return (
    <div className="rounded-[32px] border border-blue-100 bg-white p-7 shadow-sm transition hover:shadow-md">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          {/* TITLE */}
          <p className="text-xs font-bold tracking-[0.35em] text-blue-700 uppercase">
            {title}
          </p>

          {/* VALUE */}
          <h1 className="mt-5 text-6xl font-black tracking-tight text-black">
            {value}
          </h1>
        </div>

        {/* ICON */}
        {icon && (
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {(trend || subtitle) && (
        <div className="mt-7 flex items-center justify-between">
          {/* TREND */}
          {trend && (
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                isNegative
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isNegative ? (
                <ArrowDownRight className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}

              {trend}
            </div>
          )}

          {/* SUBTITLE */}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
