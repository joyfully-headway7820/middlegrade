import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Stat } from "@/components/ui/Stat";
import { FIVE_GRADE_SYSTEM_DATE } from "@/constants/constants";
import { formatGrade, formatPercent } from "@/lib/format";
import { marksQuery } from "@/lib/queries";
import { countMiddle } from "@/utils/countMiddle";
import distributeData from "@/utils/distributeData";
import { distributeVisits } from "@/utils/distributeVisits";

export const DashboardStats = () => {
  const marks = useQuery(marksQuery());
  const visits = marks.data ?? [];

  const { average, gradeCount } = useMemo(() => {
    const distributed = distributeData(visits, FIVE_GRADE_SYSTEM_DATE);

    return {
      average: countMiddle(distributed.gradeSum, distributed.grades),
      gradeCount: distributed.grades.length,
    };
  }, [visits]);

  const attendance = useMemo(() => distributeVisits(visits), [visits]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Stat
        label="Средний балл"
        value={average ? formatGrade(average) : "—"}
        hint={gradeCount ? `${gradeCount} оценок` : undefined}
      />
      <Stat
        label="Посещаемость"
        value={visits.length ? formatPercent(attendance.wasPercent) : "—"}
        hint={
          visits.length
            ? `${attendance.studentWas} из ${visits.length} пар`
            : undefined
        }
      />
    </div>
  );
};
