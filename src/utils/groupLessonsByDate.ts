import type { ScheduleLesson } from "@/types";

export const groupLessonsByDate = (
  lessons: ScheduleLesson[],
): Map<string, ScheduleLesson[]> => {
  const grouped = new Map<string, ScheduleLesson[]>();

  for (const lesson of lessons) {
    const bucket = grouped.get(lesson.date);

    if (bucket) {
      bucket.push(lesson);
    } else {
      grouped.set(lesson.date, [lesson]);
    }
  }

  for (const bucket of grouped.values()) {
    bucket.sort((a, b) => a.lesson - b.lesson);
  }

  return grouped;
};
