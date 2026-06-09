import StatsCard from "../dashboard/stats-card";

export default function AmaStatsGrid({ stats }: any) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="TOTAL AMA" value={stats.total} color="blue" />

      <StatsCard title="SUCCESS" value={stats.success} color="green" />

      <StatsCard title="ONGOING" value={stats.ongoing} color="yellow" />

      <StatsCard title="PENDING" value={stats.pending} color="red" />
    </div>
  );
}
