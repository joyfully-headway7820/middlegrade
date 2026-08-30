import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import { startOfWeek } from "@/lib/format";
import type { ScheduleLesson } from "@/types";

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

const weekStart = startOfWeek(new Date(2026, 8, 2));

describe("ScheduleTable", () => {
  it("renders a week grid with every day and filled lesson cells", () => {
    render(
      <ScheduleTable
        weekStart={weekStart}
        lessons={[
          lesson({ date: "2026-09-01", subject_name: "ASP.NET" }),
          lesson({
            date: "2026-09-02",
            subject_name: "WPF",
            room_name: "207 Фабричка",
          }),
        ]}
        today={new Date(2026, 8, 2)}
      />,
    );

    expect(screen.getByRole("columnheader", { name: /понедельник/i })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: /воскресенье/i })).toBeTruthy();
    expect(screen.getByRole("rowheader", { name: "1" })).toBeTruthy();
    expect(screen.getByText("ASP.NET")).toBeTruthy();
    expect(screen.getByText("WPF")).toBeTruthy();
    expect(screen.getByText("Дистант 7")).toBeTruthy();
    expect(screen.getByText("207 Фабричка")).toBeTruthy();
    expect(screen.getAllByText("Хамитов Илья Раильевич")).toHaveLength(2);
  });

  it("shows an empty week message when there are no lessons", () => {
    render(
      <ScheduleTable weekStart={weekStart} lessons={[]} today={new Date(2026, 8, 2)} />,
    );

    expect(screen.getByText("На этой неделе пар нет")).toBeTruthy();
  });
});
