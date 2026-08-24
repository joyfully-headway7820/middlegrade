import { describe, expect, it } from "vitest";
import type { StudentReview } from "@/types";
import { sortReviews } from "@/utils/sortReviews";

const review = (date: string, teacher: string): StudentReview => ({
  date,
  teacher,
  spec: "Предмет",
  full_spec: "Предмет",
  message: "Ок",
});

describe("sortReviews", () => {
  it("puts the latest review first when the API sent oldest-first", () => {
    const sorted = sortReviews([
      review("2024-03-20", "Физика"),
      review("2024-04-11", "История"),
      review("2025-03-17", "ОС"),
    ]);

    expect(sorted.map((item) => item.date)).toEqual([
      "2025-03-17",
      "2024-04-11",
      "2024-03-20",
    ]);
  });

  it("keeps newest-first when the API already sent that order", () => {
    const sorted = sortReviews([
      review("2025-03-17", "ОС"),
      review("2024-04-11", "История"),
      review("2024-03-20", "Физика"),
    ]);

    expect(sorted.map((item) => item.teacher)).toEqual([
      "ОС",
      "История",
      "Физика",
    ]);
  });

  it("parses dotted dates as day.month.year and keeps equal dates stable", () => {
    const first = review("11.04.2024", "А");
    const second = review("11.04.2024", "Б");
    const sorted = sortReviews([
      first,
      review("04.11.2024", "Ноябрь"),
      review("17.03.2025", "В"),
      second,
    ]);

    expect(sorted.map((item) => item.teacher)).toEqual([
      "В",
      "Ноябрь",
      "А",
      "Б",
    ]);
  });
});
