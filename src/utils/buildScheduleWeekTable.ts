import { addDays, toIsoDate } from "@/lib/format";
import type { ScheduleLesson } from "@/types";

export type ScheduleWeekDay = {
  date: Date;
  iso: string;
};

export type ScheduleWeekTable = {
  days: ScheduleWeekDay[];
  slots: number[];
  cells: Map<string, ScheduleLesson>;
};

export const scheduleCellKey = (iso: string, slot: number) => `${iso}:${slot}`;

const lessonSlots = (lessons: ScheduleLesson[]) => {
  if (lessons.length === 0) {
    return [];
  }

  const min = Math.min(...lessons.map((item) => item.lesson));
  const max = Math.max(...lessons.map((item) => item.lesson));

  return Array.from({ length: max - min + 1 }, (_, index) => min + index);
};

export const buildScheduleWeekTable = (
  weekStart: Date,
  lessons: ScheduleLesson[],
): ScheduleWeekTable => {
  const days: ScheduleWeekDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return { date, iso: toIsoDate(date) };
  });

  const cells = new Map<string, ScheduleLesson>();

  for (const lesson of lessons) {
    cells.set(scheduleCellKey(lesson.date, lesson.lesson), lesson);
  }

  return { days, slots: lessonSlots(lessons), cells };
};
