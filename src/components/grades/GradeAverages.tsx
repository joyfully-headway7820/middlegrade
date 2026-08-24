import { MetricCard } from "./MetricCard";
import { formatGrade } from "@/lib/format";
import { countMiddle } from "@/utils/countMiddle";
import type { IMarks } from "@/utils/distributeData";

type GradeAveragesProps = {
  marks: IMarks;
};

const display = (sum: number, list: number[]) =>
  list.length ? formatGrade(countMiddle(sum, list)) : "0";

export const GradeAverages = ({ marks }: GradeAveragesProps) => (
  <section className="flex flex-col gap-3">
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-heading">
        Средний балл
      </h2>
      <p className="mt-1 text-xs text-ink-500">
        Оценки до 31 августа 2024 пересчитаны из 12-балльной шкалы в 5-балльную
      </p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        tone="neutral"
        label="Средний балл"
        value={display(marks.gradeSum, marks.grades)}
      />
      <MetricCard
        tone="classwork"
        label="Средний балл за работу на паре"
        value={display(marks.classGradeSum, marks.classWork)}
      />
      <MetricCard
        tone="control"
        label="Средний балл за контрольные"
        value={display(marks.controlGradeSum, marks.controlWork)}
      />
      <MetricCard
        tone="homework"
        label="Средний балл за домашки"
        value={display(marks.homeGradeSum, marks.homeWork)}
      />
      <MetricCard
        tone="lab"
        label="Средний балл за лабы"
        value={display(marks.labGradeSum, marks.labs)}
      />
      <MetricCard
        tone="practical"
        label="Средний балл за практические"
        value={display(marks.practicalsSum, marks.practicals)}
      />
    </div>
  </section>
);
