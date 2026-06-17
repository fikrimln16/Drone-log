import { ShieldCheck } from "lucide-react";

type Props = {
  summary: any;
};

export default function PilotWorkloadSection({ summary }: Props) {
  const hours = Number(summary.total_hours_this_month) || 0;

  const highLoad = hours >= 15;

  return (
    <div className="rounded-[32px] border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-green-600" />

        <h1 className="text-2xl font-bold">Workload Status This Month</h1>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <div
            className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
              highLoad
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {highLoad ? "HIGH LOAD" : "NORMAL"}
          </div>

          <p className="mt-4 text-slate-500">
            {highLoad
              ? "Pilot workload exceeded recommended threshold."
              : "Workload within safe operational limits."}
          </p>

          <h1 className="mt-2 text-lg font-bold">{hours.toFixed(1)} hr</h1>
        </div>

        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full border-[10px] ${
            highLoad ? "border-red-200" : "border-green-200"
          }`}
        >
          <ShieldCheck
            className={`h-12 w-12 ${
              highLoad ? "text-red-500" : "text-green-500"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
