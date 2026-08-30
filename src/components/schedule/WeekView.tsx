import { LessonCard } from "./LessonCard";
import { WEEKDAYS_SHORT } from "@/constants/constants";
import { cn } from "@/lib/cn";
import { addDays, isSameDay, toIsoDate } from "@/lib/format";
import type { ScheduleLesson } from "@/types";

type WeekViewProps = {
  weekStart: Date;
  lessonsByDate: Map<string, ScheduleLesson[]>;
  today: Date;
};

export const WeekView = ({ weekStart, lessonsByDate, today }: WeekViewProps) => (
  <div className="scrollbar-slim -mx-5 overflow-x-auto px-5">
    <div className="grid w-max min-w-full grid-cols-7 gap-3">
      {Array.from({ length: 7 }, (_, index) => {
        const day = addDays(weekStart, index);
        const iso = toIsoDate(day);
        const lessons = lessonsByDate.get(iso) ?? [];
        const current = isSameDay(day, today);

        return (
          <section
            key={iso}
            className={cn(
              "flex w-56 flex-col rounded-xl border p-3",
              current ? "border-brand-500/50 bg-brand-600/8" : "border-line",
            )}
          >
            <header className="mb-3 flex items-baseline gap-2">
              <span
                className={cn(
                  "text-sm font-semibold uppercase",
                  current ? "text-brand-600" : "text-ink-200",
                )}
              >
                {WEEKDAYS_SHORT[index]}
              </span>
              <span className="text-xs text-ink-300 tabular-nums">
                {day.getDate()}.{String(day.getMonth() + 1).padStart(2, "0")}
              </span>
            </header>

            {lessons.length ? (
              <ul className="flex flex-col gap-2">
                {lessons.map((lesson) => (
                  <LessonCard key={`${iso}-${lesson.lesson}`} lesson={lesson} />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-xs text-ink-600">Пар нет</p>
            )}
          </section>
        );
      })}
    </div>
  </div>
);
