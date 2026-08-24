import { MetricCard } from "./MetricCard";
import { formatPercent } from "@/lib/format";
import type { IVisits } from "@/utils/distributeVisits";

type AttendanceStatsProps = {
  visits: IVisits;
  total: number;
};

export const AttendanceStats = ({ visits, total }: AttendanceStatsProps) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-lg font-semibold tracking-tight text-heading">
      Посещаемость
    </h2>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard tone="neutral" label="Всего пар" value={total} />
      <MetricCard
        tone="present"
        label="Посещено пар"
        value={total ? formatPercent(visits.wasPercent) : "0%"}
        badge={visits.studentWas}
      />
      <MetricCard
        tone="late"
        label="Опозданий"
        value={total ? formatPercent(visits.latePercent) : "0%"}
        badge={visits.studentLate}
      />
      <MetricCard
        tone="absent"
        label="Пропусков"
        value={total ? formatPercent(visits.wasntPercent) : "0%"}
        badge={visits.studentWasnt}
      />
    </div>
  </section>
);
