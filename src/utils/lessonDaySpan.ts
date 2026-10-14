import type { ScheduleLesson } from "@/types";

export type LessonDaySpan = {
  startedAt: string;
  finishedAt: string;
};

export const lessonDaySpan = (lessons: ScheduleLesson[]): LessonDaySpan | null => {
  if (lessons.length === 0) {
    return null;
  }

  let startedAt = lessons[0].started_at;
  let finishedAt = lessons[0].finished_at;

  for (const lesson of lessons) {
    if (lesson.started_at < startedAt) {
      startedAt = lesson.started_at;
    }

    if (lesson.finished_at > finishedAt) {
      finishedAt = lesson.finished_at;
    }
  }

  return { startedAt, finishedAt };
};
