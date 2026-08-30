import { describe, expect, it } from "vitest";
import { startOfWeek } from "@/lib/format";
import type { ScheduleLesson } from "@/types";
import {
  buildScheduleWeekTable,
  scheduleCellKey,
} from "@/utils/buildScheduleWeekTable";

const lesson = (overrides: Partial<ScheduleLesson>): ScheduleLesson => ({
  date: "2026-09-01",
  lesson: 1,
  started_at: "08:00:00",
  finished_at: "09:20:00",
  teacher_name: "Андреев Андрей Андреевич",
  subject_name: "ASP.NET",
  room_name: "Онлайн 1",
  ...overrides,
});

describe("buildScheduleWeekTable", () => {
  const weekStart = startOfWeek(new Date(2026, 8, 2));

  it("builds a seven-day grid and fills missing lesson slots", () => {
    const table = buildScheduleWeekTable(weekStart, [
      lesson({ date: "2026-09-01", lesson: 1, subject_name: "ASP.NET" }),
      lesson({ date: "2026-09-04", lesson: 3, subject_name: "Базы данных" }),
    ]);

    expect(table.days.map((day) => day.iso)).toEqual([
      "2026-08-31",
      "2026-09-01",
      "2026-09-02",
      "2026-09-03",
      "2026-09-04",
      "2026-09-05",
      "2026-09-06",
    ]);
    expect(table.slots).toEqual([1, 2, 3]);
    expect(
      table.cells.get(scheduleCellKey("2026-09-01", 1))?.subject_name,
    ).toBe("ASP.NET");
    expect(table.cells.get(scheduleCellKey("2026-08-31", 1))).toBeUndefined();
  });

  it("has no rows when the week is free", () => {
    const table = buildScheduleWeekTable(weekStart, []);

    expect(table.days).toHaveLength(7);
    expect(table.slots).toEqual([]);
    expect(table.cells.size).toBe(0);
  });

  it("builds a single-day grid", () => {
    const table = buildScheduleWeekTable(
      new Date(2026, 8, 1),
      [
        lesson({
          date: "2026-09-01",
          lesson: 1,
          started_at: "08:00",
          finished_at: "09:20",
        }),
        lesson({
          date: "2026-09-01",
          lesson: 3,
          started_at: "11:30",
          finished_at: "12:50",
        }),
      ],
      1,
    );

    expect(table.days.map((day) => day.iso)).toEqual(["2026-09-01"]);
    expect(table.slots).toEqual([1, 2, 3]);
    expect(table.cells.get(scheduleCellKey("2026-09-01", 1))?.started_at).toBe(
      "08:00",
    );
  });
});
