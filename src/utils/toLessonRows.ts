import type { StudentVisit } from "@/types";

type LessonRow = {
  visit: StudentVisit;
  number: number;
};

const compareChronological = (a: StudentVisit, b: StudentVisit): number => {
  const byDate = a.date_visit.localeCompare(b.date_visit);

  if (byDate !== 0) {
    return byDate;
  }

  return a.lesson_number - b.lesson_number;
};

export const toLessonRows = (visits: StudentVisit[]): LessonRow[] =>
  visits
    .map((visit, index) => ({ visit, index }))
    .sort((a, b) => compareChronological(a.visit, b.visit) || a.index - b.index)
    .map((item, index) => ({ visit: item.visit, number: index + 1 }))
    .reverse();
