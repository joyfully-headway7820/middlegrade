import { Clock } from "lucide-react";
import { WEEKDAYS_FULL } from "@/constants/constants";
import { cn } from "@/lib/cn";
import { formatNumericDate, formatTime, isSameDay } from "@/lib/format";
import type { ScheduleLesson } from "@/types";
import {
  buildScheduleWeekTable,
  scheduleCellKey,
} from "@/utils/buildScheduleWeekTable";

type ScheduleTableProps = {
  weekStart: Date;
  lessons: ScheduleLesson[];
  today: Date;
  dayCount?: number;
};

const weekdayName = (date: Date) => WEEKDAYS_FULL[(date.getDay() + 6) % 7];

export const ScheduleTable = ({
  weekStart,
  lessons,
  today,
  dayCount = 7,
}: ScheduleTableProps) => {
  const table = buildScheduleWeekTable(weekStart, lessons, dayCount);

  if (table.slots.length === 0) {
    return (
      <p className="rounded-2xl bg-canvas px-4 py-10 text-center text-sm text-ink-400">
        {dayCount === 1 ? "В этот день пар нет" : "На этой неделе пар нет"}
      </p>
    );
  }

  return (
    <div className="scrollbar-slim overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse",
          dayCount === 1 ? "min-w-0" : "min-w-[64rem]",
        )}
      >
          <thead>
            <tr>
              <th className="w-11 border border-brand-700 bg-brand-600 p-2" />
              {table.days.map((day) => (
                <th
                  key={day.iso}
                  scope="col"
                  className={cn(
                    "border border-brand-700 bg-brand-600 px-2 py-2 text-center text-xs font-semibold text-white",
                    isSameDay(day.date, today) && "bg-brand-500",
                  )}
                >
                  <span className="block lowercase">{weekdayName(day.date)}</span>
                  <span className="mt-0.5 block text-[11px] font-medium tabular-nums text-white/90">
                    {formatNumericDate(day.iso)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slots.map((slot) => (
              <tr key={slot}>
                <th
                  scope="row"
                  className="border border-brand-700 bg-brand-600 px-2 py-3 text-center text-sm font-semibold text-white tabular-nums"
                >
                  {slot}
                </th>
                {table.days.map((day) => {
                  const item = table.cells.get(scheduleCellKey(day.iso, slot));

                  return (
                    <td
                      key={day.iso}
                      className="border border-line bg-surface p-2 align-top"
                    >
                      {item ? (
                        <div className="flex min-w-0 flex-col gap-1">
                          <p className="inline-flex items-center gap-1 text-[11px] text-ink-400 tabular-nums">
                            <Clock className="size-3 shrink-0" aria-hidden />
                            {formatTime(item.started_at)}–{formatTime(item.finished_at)}
                          </p>
                          <p className="text-xs leading-snug font-semibold break-words text-ink-50">
                            {item.subject_name}
                          </p>
                          <p className="text-[11px] leading-snug break-words text-ink-400">
                            {item.room_name}
                          </p>
                          <p className="text-[11px] leading-snug break-words text-ink-400">
                            {item.teacher_name}
                          </p>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};
