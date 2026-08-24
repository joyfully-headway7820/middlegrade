import { useMemo } from "react";
import { WEEKDAYS_SHORT } from "@/constants/constants";
import { cn } from "@/lib/cn";
import { addDays, formatTime, isSameDay, startOfMonth, startOfWeek, toIsoDate } from "@/lib/format";
import { pluralRu } from "@/utils/pluralRu";
import type { ScheduleLesson } from "@/types";

type MonthViewProps = {
  anchor: Date;
  lessonsByDate: Map<string, ScheduleLesson[]>;
  today: Date;
  onSelectDay: (date: Date) => void;
};

const buildCells = (anchor: Date): Date[] => {
  const first = startOfMonth(anchor);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));

  return cells[35].getMonth() === first.getMonth() ? cells : cells.slice(0, 35);
};

export const MonthView = ({
  anchor,
  lessonsByDate,
  today,
  onSelectDay,
}: MonthViewProps) => {
  const cells = useMemo(() => buildCells(anchor), [anchor]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAYS_SHORT.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium tracking-wide text-ink-500 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((day) => {
          const iso = toIsoDate(day);
          const lessons = lessonsByDate.get(iso) ?? [];
          const outside = day.getMonth() !== anchor.getMonth();
          const current = isSameDay(day, today);

          return (
            <button
              key={iso}
              type="button"
              disabled={lessons.length === 0}
              onClick={() => onSelectDay(day)}
              aria-label={`${iso}, ${lessons.length} ${pluralRu(lessons.length, ["пара", "пары", "пар"])}`}
              className={cn(
                "flex min-h-20 flex-col items-start gap-1 rounded-xl border p-2 text-left transition-colors sm:min-h-24 sm:p-2.5",
                outside ? "border-line opacity-50" : "border-line",
                lessons.length
                  ? "bg-surface hover:border-brand-500/60 hover:bg-brand-600/10"
                  : "cursor-default bg-transparent",
                current && "border-brand-500/60 bg-brand-600/10",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium tabular-nums",
                  outside ? "text-ink-600" : "text-ink-300",
                  current && "text-brand-200",
                )}
              >
                {day.getDate()}
              </span>

              {lessons.length ? (
                <span className="mt-auto flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-brand-200">
                    {lessons.length} {pluralRu(lessons.length, ["пара", "пары", "пар"])}
                  </span>
                  <span className="hidden text-[11px] text-ink-500 tabular-nums sm:inline">
                    {formatTime(lessons[0].started_at)}–
                    {formatTime(lessons[lessons.length - 1].finished_at)}
                  </span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
