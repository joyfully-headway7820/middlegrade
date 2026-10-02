import type { HomeworkCount } from "@/types";

export const homeworkCounter = (
  counts: readonly HomeworkCount[] | undefined,
  counterType: number,
): number =>
  counts?.find((entry) => entry.counter_type === counterType)?.counter ?? 0;
