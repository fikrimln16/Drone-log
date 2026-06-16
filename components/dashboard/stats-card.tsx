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

export default function StatsCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  iconBg,
}: Props) {
  const isPositive = !trend?.includes("-");

  return (
    <div className="rounded-[28px] border bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>

          <h1 className="mt-3 text-[34px] leading-none font-bold tracking-tight text-black xl:text-[42px]">
            {value}
          </h1>
        </div>

        {icon && (
          <div className={`rounded-2xl p-4 ${iconBg || "bg-gray-100"}`}>
            {icon}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between">
        {trend ? (
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
              isPositive
                ? "bg-[#dcfce7] text-[#16a34a]"
                : "bg-[#fee2e2] text-[#dc2626]"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}

            {trend}
          </div>
        ) : (
          <div />
        )}

        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
