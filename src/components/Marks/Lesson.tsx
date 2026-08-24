import { BookCheck, CircleCheck, CircleX, Timer } from "lucide-react";
import { memo } from "react";
import { MARK_KINDS, VISIT_STATUS } from "@/constants/constants";
import { cn } from "@/lib/cn";
import { formatNumericDate } from "@/lib/format";
import type { StudentVisit } from "@/types";

const FIELD_BY_KIND: Record<
  (typeof MARK_KINDS)[number]["key"],
  keyof StudentVisit
> = {
  classwork: "class_work_mark",
  homework: "home_work_mark",
  laboratory: "lab_work_mark",
  control: "control_work_mark",
  practical: "practical_work_mark",
  exams: "final_work_mark",
};

const Attendance = ({ status }: { status: number | null }) => {
  if (status === VISIT_STATUS.PRESENT) {
    return (
      <CircleCheck className="size-5 text-good" aria-label="Был на паре" />
    );
  }

  if (status === VISIT_STATUS.ABSENT) {
    return <CircleX className="size-5 text-bad" aria-label="Пропуск" />;
  }

  if (status === VISIT_STATUS.LATE) {
    return <Timer className="size-5 text-warn" aria-label="Опоздание" />;
  }

  return <BookCheck className="size-5 text-ink-500" aria-label="Без отметки" />;
};

type LessonProps = {
  visit: StudentVisit;
  number: number;
};

export const Lesson = memo(({ visit, number }: LessonProps) => {
  const marks = MARK_KINDS.map((kind) => ({
    kind,
    value: visit[FIELD_BY_KIND[kind.key]],
  })).filter(
    (mark): mark is { kind: (typeof MARK_KINDS)[number]; value: number } =>
      typeof mark.value === "number" && mark.value > 0,
  );

  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-line px-4 py-3 last:border-0 sm:flex-nowrap">
      <span className="mt-0.5 shrink-0">
        <Attendance status={visit.status_was} />
      </span>

      <div className="w-24 shrink-0">
        <p className="text-sm text-ink-200 tabular-nums">
          {formatNumericDate(visit.date_visit)}
        </p>
        <p className="text-xs text-ink-500">Пара {number}</p>
      </div>

      <div className="min-w-0 flex-1 basis-full sm:basis-auto">
        <p className="text-sm font-medium break-words text-ink-50">
          {visit.spec_name}
        </p>
        <p className="text-xs break-words text-ink-400">{visit.teacher_name}</p>
        {visit.lesson_theme ? (
          <p className="mt-0.5 text-xs break-words text-ink-500">
            {visit.lesson_theme}
          </p>
        ) : null}
      </div>

      {marks.length ? (
        <ul className="flex shrink-0 flex-wrap items-center gap-1.5">
          {marks.map((mark) => (
            <li
              key={mark.kind.key}
              title={mark.kind.label}
              className={cn(
                "grid size-8 place-items-center rounded-lg border border-line",
                "bg-overlay text-sm font-semibold text-heading tabular-nums",
              )}
              style={{ boxShadow: `inset 0 -2px 0 0 ${mark.kind.color}` }}
            >
              {mark.value}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
});

Lesson.displayName = "Lesson";
