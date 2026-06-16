import { Clock3, Plane, Briefcase, MapPinned } from "lucide-react";

type Props = {
  summary: any;
};

export default function PilotStatsCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Hours",
      value: `${Number(summary.total_hours || 0).toFixed(1)} hr`,
      icon: Clock3,
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      title: "Flights",
      value: summary.total_flights || 0,
      icon: Plane,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Missions",
      value: summary.total_missions || 0,
      icon: Briefcase,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "AMA Coverage",
      value: summary.total_amas || 0,
      icon: MapPinned,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-[24px] border bg-slate-50 p-5"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm text-slate-500">{item.title}</p>

            <h1 className="mt-2 text-3xl font-black text-slate-900">
              {item.value}
            </h1>
          </div>
        );
      })}
    </div>
  );
}
