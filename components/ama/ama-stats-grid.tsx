import AmaStatsCard from "./ama-stats-card";

import {
  MapPinned,
  CheckCircle2,
  Activity,
  ArrowRightCircle,
  Clock3,
} from "lucide-react";

export default function AmaStatsGrid({ stats }: any) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* TOTAL AMA */}
      {/* <AmaStatsCard
        title="TOTAL AMA"
        value={Array.isArray(stats) ? stats.length : 0}
        subtitle="Operational Areas"
        icon={<MapPinned className="h-5 w-5 text-blue-600" />}
        iconBg="bg-blue-100"
      /> */}

      {/* SUCCESS */}
      <AmaStatsCard
        title="SUCCESS"
        value={stats?.success || 0}
        subtitle="Completed"
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        iconBg="bg-green-100"
      />

      {/* ON PROGRESS */}
      <AmaStatsCard
        title="ON PROGRESS"
        value={stats?.ongoing || 0}
        subtitle="In Progress"
        icon={<Activity className="h-5 w-5 text-sky-600" />}
        iconBg="bg-sky-100"
      />

      {/* NEXT */}
      <AmaStatsCard
        title="NEXT"
        value={stats?.next || 0}
        subtitle="Upcoming"
        icon={<ArrowRightCircle className="h-5 w-5 text-orange-600" />}
        iconBg="bg-orange-100"
      />

      {/* WAITING */}
      <AmaStatsCard
        title="WAITING"
        value={stats?.waiting || 0}
        subtitle="Pending Schedule"
        icon={<Clock3 className="h-5 w-5 text-yellow-600" />}
        iconBg="bg-yellow-100"
      />
    </div>
  );
}
