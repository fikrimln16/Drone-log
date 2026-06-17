import { BarChart3 } from "lucide-react";

type Props = {
  summary: any;
};

export default function PilotPerformanceSection({ summary }: Props) {
  const current = Number(summary.total_hours_this_month) || 0;

  const target = 15;

  const percentage = Math.min((current / target) * 100, 100);

  const achieved = current >= target;

  return (
    <div className="rounded-[32px] border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-slate-500" />

        <h1 className="text-2xl font-bold">Performance This Month</h1>
      </div>

      <div className="mt-6">
        <div
          className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
            achieved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {achieved ? "TARGET ACHIEVED" : "UNDER TARGET"}
        </div>

        <h1 className="mt-5 text-3xl font-black">{current} / 15 hr</h1>

        <p className="mt-1 text-slate-500">Target 15 hours per month</p>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${
              achieved ? "bg-green-500" : "bg-yellow-500"
            }`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <h1 className="mt-3 text-right font-bold">{percentage.toFixed(0)}%</h1>
      </div>
    </div>
  );
}
