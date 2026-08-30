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
  teacher_name: "Хамитов Илья Раильевич",
  subject_name: "ASP.NET",
  room_name: "Дистант 7",
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
});
