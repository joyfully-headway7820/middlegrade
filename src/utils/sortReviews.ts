import type { StudentReview } from "@/types";

const toTimestamp = (value: string): number => {
  const dotted = /^(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(value);
  const day = dotted?.[1];
  const month = dotted?.[2];
  const year = dotted?.[3];

  if (day && month && year) {
    return Date.parse(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    );
  }

  const iso = Date.parse(value);
  return Number.isNaN(iso) ? Number.NEGATIVE_INFINITY : iso;
};

export const sortReviews = (reviews: StudentReview[]): StudentReview[] =>
  [...reviews].sort(
    (left, right) => toTimestamp(right.date) - toTimestamp(left.date),
  );
