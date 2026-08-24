import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import Marks from "@/components/Marks";
import { AttendanceStats } from "@/components/grades/AttendanceStats";
import { ExamRecords } from "@/components/grades/ExamRecords";
import { GradeAverages } from "@/components/grades/GradeAverages";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Checkbox, Segmented, Select } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { ALL_SPECS, FIVE_GRADE_SYSTEM_DATE } from "@/constants/constants";
import { useStoredState } from "@/hooks/useStoredState";
import { examsQuery, marksQuery } from "@/lib/queries";
import { buildSpecList } from "@/utils/buildSpecList";
import { currentCourseStart } from "@/utils/currentCourseStart";
import distributeData from "@/utils/distributeData";
import { distributeVisits } from "@/utils/distributeVisits";
import { filterVisits } from "@/utils/filterVisits";
import { isEmptyError } from "@/utils/isEmptyError";
import { removeGroupPostfix } from "@/utils/removeGroupPostfix";

const PERIOD_OPTIONS = [
  { value: "course" as const, label: "Текущий курс" },
  { value: "all" as const, label: "Всё время" },
];

export const GradesPage = () => {
  const marks = useQuery(marksQuery());
  const exams = useQuery(examsQuery());

  const [spec, setSpec] = useState<string>(ALL_SPECS);
  const [period, setPeriod] = useState<"course" | "all">("course");
  const [hideCompleted, setHideCompleted] = useStoredState(
    "grades:hideCompleted",
    true,
  );

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
    () =>
      spec === ALL_SPECS || period === "all" ? null : currentCourseStart(),
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

  const filteredExams = useMemo(() => {
    if (!exams.data) return [];

    return spec === ALL_SPECS
      ? exams.data
      : exams.data.filter((exam) => removeGroupPostfix(exam.spec) === spec);
  }, [exams.data, spec]);

  if (marks.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      </div>
    );
  }

  if (isEmptyError(marks)) {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Оценки
        </h1>

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

      <GradeAverages marks={distributed} />
      <AttendanceStats visits={visits} total={filtered.length} />

      <Card>
        <CardHeader
          title="Занятия"
          description={`${filtered.length} занятий`}
        />
        <CardBody>
          <Marks marks={filtered} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Зачётка"
          description={`${filteredExams.length} записей`}
        />
        {exams.isPending ? (
          <CardBody>
            <Skeleton className="h-40" />
          </CardBody>
        ) : isEmptyError(exams) ? (
          <ErrorState
            message="Не удалось загрузить зачётку"
            onRetry={() => void exams.refetch()}
          />
        ) : filteredExams.length === 0 ? (
          <EmptyState title="Записей нет" />
        ) : (
          <ExamRecords exams={filteredExams} />
        )}
      </Card>
    </div>
  );
};
