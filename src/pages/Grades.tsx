import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Marks from "@/components/Marks";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge, Checkbox, Segmented, Select } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { Stat } from "@/components/ui/Stat";
import { ALL_SPECS, FIVE_GRADE_SYSTEM_DATE } from "@/constants/constants";
import { useStoredState } from "@/hooks/useStoredState";
import { formatDate, formatGrade, formatPercent } from "@/lib/format";
import { examsQuery, marksQuery } from "@/lib/queries";
import { buildSpecList } from "@/utils/buildSpecList";
import { countMiddle } from "@/utils/countMiddle";
import { currentCourseStart } from "@/utils/currentCourseStart";
import distributeData from "@/utils/distributeData";
import { distributeVisits } from "@/utils/distributeVisits";
import { filterVisits } from "@/utils/filterVisits";
import { removeGroupPostfix } from "@/utils/removeGroupPostfix";
import { toFive } from "@/utils/toFive";
import type { StudentExam } from "@/types";

const PERIOD_OPTIONS = [
  { value: "course" as const, label: "Текущий курс" },
  { value: "all" as const, label: "Всё время" },
];

const gradeTone = (value: number) => {
  if (value >= 4.5) return "good" as const;
  if (value >= 3.5) return "warn" as const;
  return "bad" as const;
};

const examMark = (exam: StudentExam) => {
  if (exam.mark === null) return null;
  if (!exam.date) return exam.mark;

  return new Date(exam.date) < FIVE_GRADE_SYSTEM_DATE ? toFive(exam.mark) : exam.mark;
};

export const GradesPage = () => {
  const marks = useQuery(marksQuery());
  const exams = useQuery(examsQuery());

  const [spec, setSpec] = useState<string>(ALL_SPECS);
  const [period, setPeriod] = useState<"course" | "all">("course");
  const [hideCompleted, setHideCompleted] = useStoredState("grades:hideCompleted", true);

  const specList = useMemo(
    () =>
      buildSpecList({
        visits: marks.data ?? [],
        exams: exams.data ?? [],
        hideCompleted,
      }),
    [marks.data, exams.data, hideCompleted],
  );

  if (marks.data && spec !== ALL_SPECS && !specList.includes(spec)) {
    setSpec(ALL_SPECS);
  }

  const since = useMemo(
    () => (spec === ALL_SPECS || period === "all" ? null : currentCourseStart()),
    [spec, period],
  );

  const filtered = useMemo(
    () => filterVisits({ visits: marks.data ?? [], spec, since }),
    [marks.data, spec, since],
  );

  const distributed = useMemo(
    () => distributeData(filtered, FIVE_GRADE_SYSTEM_DATE),
    [filtered],
  );

  const visits = useMemo(() => distributeVisits(filtered), [filtered]);

  const average = countMiddle(distributed.gradeSum, distributed.grades);

  const filteredExams = useMemo(() => {
    if (!exams.data) return [];

    return spec === ALL_SPECS
      ? exams.data
      : exams.data.filter((exam) => removeGroupPostfix(exam.spec) === spec);
  }, [exams.data, spec]);

  if (marks.isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (marks.isError) {
    return (
      <ErrorState
        message="Не удалось загрузить оценки"
        onRetry={() => void marks.refetch()}
      />
    );
  }

  const specOptions = [
    { value: ALL_SPECS, label: ALL_SPECS },
    ...specList.map((name) => ({ value: name, label: name })),
  ];

  const breakdown = [
    { label: "Классная работа", sum: distributed.classGradeSum, list: distributed.classWork },
    { label: "Домашняя работа", sum: distributed.homeGradeSum, list: distributed.homeWork },
    { label: "Лабораторные", sum: distributed.labGradeSum, list: distributed.labs },
    { label: "Контрольные", sum: distributed.controlGradeSum, list: distributed.controlWork },
    { label: "Практические", sum: distributed.practicalsSum, list: distributed.practicals },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">Оценки</h1>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {spec === ALL_SPECS ? null : (
            <Segmented
              options={PERIOD_OPTIONS}
              value={period}
              onChange={setPeriod}
              ariaLabel="Период"
            />
          )}
          <Checkbox
            label="Убрать завершённые"
            hint="Скрывает предметы, по которым уже прошёл зачёт или экзамен"
            checked={hideCompleted}
            onChange={setHideCompleted}
          />
          <Select
            options={specOptions}
            value={spec}
            onChange={setSpec}
            ariaLabel="Фильтр по предмету"
            className="w-full sm:w-72"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Средний балл"
          value={average ? formatGrade(average) : "—"}
          hint={`${distributed.grades.length} оценок`}
        />
        <Stat
          label="Посещаемость"
          value={filtered.length ? formatPercent(visits.wasPercent) : "—"}
          hint={`${visits.studentWas} из ${filtered.length} пар`}
        />
        <Stat
          label="Опоздания"
          value={visits.studentLate}
          hint={filtered.length ? formatPercent(visits.latePercent) : undefined}
        />
        <Stat
          label="Пропуски"
          value={visits.studentWasnt}
          hint={filtered.length ? formatPercent(visits.wasntPercent) : undefined}
        />
      </div>

      <Card>
        <CardHeader
          title="Средний балл по типам работ"
          description="Оценки до 31 августа 2024 пересчитаны из 12-балльной шкалы в 5-балльную"
        />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {breakdown.map((item) => {
            const value = countMiddle(item.sum, item.list);

            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-300">{item.label}</p>
                  <p className="text-xs text-ink-500">{item.list.length} оценок</p>
                </div>
                {item.list.length ? (
                  <Badge tone={gradeTone(value)}>{formatGrade(value)}</Badge>
                ) : (
                  <Badge>—</Badge>
                )}
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Занятия" description={`${filtered.length} занятий`} />
        <CardBody>
          <Marks marks={filtered} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Зачётка" description={`${filteredExams.length} записей`} />
        {exams.isPending ? (
          <CardBody>
            <Skeleton className="h-40" />
          </CardBody>
        ) : exams.isError ? (
          <ErrorState
            message="Не удалось загрузить зачётку"
            onRetry={() => void exams.refetch()}
          />
        ) : filteredExams.length === 0 ? (
          <EmptyState title="Записей нет" />
        ) : (
          <div className="scrollbar-slim overflow-x-auto">
            <table className="w-full min-w-3xl text-left text-sm">
              <thead className="text-xs tracking-wide text-ink-500 uppercase">
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-3 font-medium">Предмет</th>
                  <th scope="col" className="px-5 py-3 font-medium">Преподаватель</th>
                  <th scope="col" className="px-5 py-3 font-medium">Дата</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Оценка</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.map((exam, index) => {
                  const mark = examMark(exam);

                  return (
                    <tr
                      key={`${exam.exam_id ?? "exam"}-${index}`}
                      className="border-b border-line last:border-0"
                    >
                      <td className="px-5 py-3 text-ink-100">{exam.spec}</td>
                      <td className="px-5 py-3 text-ink-400">{exam.teacher ?? "—"}</td>
                      <td className="px-5 py-3 text-ink-400">
                        {exam.date ? formatDate(exam.date) : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {mark ? (
                          <Badge tone={gradeTone(mark)}>{mark}</Badge>
                        ) : (
                          <span className="text-ink-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
