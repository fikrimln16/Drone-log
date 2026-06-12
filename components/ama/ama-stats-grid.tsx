import AmaStatsCard from "./ama-stats-card";

import { MapPinned, CheckCircle2, Activity, Clock3 } from "lucide-react";

export default function AmaStatsGrid({ stats }: any) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AmaStatsCard
        title="TOTAL AMA"
        value={17}
        subtitle="Operational Areas"
        icon={<MapPinned className="h-5 w-5 text-blue-600" />}
        iconBg="bg-blue-100"
      />

      <AmaStatsCard
        title="SUCCESS"
        value={6}
        subtitle="Completed"
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        iconBg="bg-green-100"
      />

      <AmaStatsCard
        title="ONGOING"
        value={2}
        subtitle="In Progress"
        icon={<Activity className="h-5 w-5 text-yellow-600" />}
        iconBg="bg-yellow-100"
      />

      <AmaStatsCard
        title="WAITING"
        value={9}
        subtitle="Pending Schedule"
        icon={<Clock3 className="h-5 w-5 text-purple-600" />}
        iconBg="bg-purple-100"
      />
    </div>
  );
}
