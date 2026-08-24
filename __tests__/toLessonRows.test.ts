import { describe, expect, it } from "vitest";
import { toLessonRows } from "@/utils/toLessonRows";
import type { StudentVisit } from "@/types";

const visit = (date_visit: string, lesson_number = 1): StudentVisit => ({
  date_visit,
  lesson_number,
  status_was: 1,
  spec_id: 1,
  teacher_name: "Преподаватель",
  spec_name: "Предмет",
  lesson_theme: "Тема",
  control_work_mark: null,
  home_work_mark: null,
  lab_work_mark: null,
  class_work_mark: null,
  practical_work_mark: null,
  final_work_mark: null,
});

describe("toLessonRows", () => {
  it("puts the latest visit first even if the API sent newest-first", () => {
    const rows = toLessonRows([
      visit("2026-02-10", 2),
      visit("2026-02-10", 1),
      visit("2023-09-04", 1),
    ]);

    expect(rows.map((row) => row.visit.date_visit)).toEqual([
      "2026-02-10",
      "2026-02-10",
      "2023-09-04",
    ]);
    expect(rows.map((row) => row.visit.lesson_number)).toEqual([2, 1, 1]);
    expect(rows.map((row) => row.number)).toEqual([3, 2, 1]);
  });

  it("puts the latest visit first even if the API sent oldest-first", () => {
    const rows = toLessonRows([
      visit("2023-09-04"),
      visit("2025-01-10"),
      visit("2026-02-10"),
    ]);

    expect(rows[0]?.visit.date_visit).toBe("2026-02-10");
    expect(rows[0]?.number).toBe(3);
    expect(rows.at(-1)?.visit.date_visit).toBe("2023-09-04");
    expect(rows.at(-1)?.number).toBe(1);
  });
});
