import { ScheduleTable } from "./ScheduleTable";
import type { ScheduleLesson } from "@/types";

type SchedulePreviewCardProps = {
  groupName: string | null | undefined;
  rangeLabel: string;
  weekStart: Date;
  lessons: ScheduleLesson[];
  today: Date;
};

export const SchedulePreviewCard = ({
  groupName,
  rangeLabel,
  weekStart,
  lessons,
  today,
}: SchedulePreviewCardProps) => (
  <article className="w-full rounded-3xl border border-line bg-surface p-3 shadow-2xl shadow-black/30 sm:p-4">
    <header className="mb-3">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-600 uppercase">
        MiddleGrade
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight text-heading">
        Расписание
      </h3>
      <p className="mt-0.5 text-sm break-words text-ink-300">{rangeLabel}</p>
      {groupName ? (
        <p className="mt-0.5 text-sm break-words text-ink-400">{groupName}</p>
      ) : null}
    </header>

    <ScheduleTable weekStart={weekStart} lessons={lessons} today={today} />
  </article>
);
