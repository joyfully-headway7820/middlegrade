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
    <div className="flex min-w-0 flex-col gap-2">
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAYS_SHORT.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium tracking-wide text-ink-500 uppercase sm:text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
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
                "flex aspect-square min-w-0 flex-col items-center justify-center gap-1 rounded-lg border p-0.5 text-center transition-colors sm:aspect-auto sm:min-h-24 sm:items-start sm:rounded-xl sm:p-2.5 sm:text-left",
                outside ? "border-line opacity-50" : "border-line",
                lessons.length
                  ? "bg-surface hover:border-brand-500/60 hover:bg-brand-600/10"
                  : "cursor-default bg-transparent",
                current && "border-brand-500/60 bg-brand-600/10",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium tabular-nums sm:text-sm",
                  outside ? "text-ink-600" : "text-ink-300",
                  current && "text-brand-200",
                )}
              >
                {day.getDate()}
              </span>

              {lessons.length ? (
                <>
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-brand-400 sm:hidden"
                  />
                  <span className="mt-auto hidden flex-col gap-0.5 sm:flex">
                    <span className="text-xs font-medium text-brand-200">
                      {lessons.length}{" "}
                      {pluralRu(lessons.length, ["пара", "пары", "пар"])}
                    </span>
                    <span className="text-[11px] text-ink-500 tabular-nums">
                      {formatTime(lessons[0].started_at)}–
                      {formatTime(lessons[lessons.length - 1].finished_at)}
                    </span>
                  </span>
                </>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
