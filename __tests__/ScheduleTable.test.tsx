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
  teacher_name: "Андреев Андрей Андреевич",
  subject_name: "ASP.NET",
  room_name: "Онлайн 1",
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
            room_name: "Кабинет 101",
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
    expect(screen.getByText("Онлайн 1")).toBeTruthy();
    expect(screen.getByText("Кабинет 101")).toBeTruthy();
    expect(screen.getAllByText("Андреев Андрей Андреевич")).toHaveLength(2);
  });

  it("shows an empty week message when there are no lessons", () => {
    render(
      <ScheduleTable weekStart={weekStart} lessons={[]} today={new Date(2026, 8, 2)} />,
    );

    expect(screen.getByText("На этой неделе пар нет")).toBeTruthy();
  });

  it("renders one weekday column for a day table", () => {
    render(
      <ScheduleTable
        weekStart={new Date(2026, 8, 1)}
        lessons={[
          lesson({
            date: "2026-09-01",
            started_at: "08:00",
            finished_at: "09:20",
            subject_name:
              "Разработка веб-приложений с использованием технологий ASP.NET и AJAX",
          }),
        ]}
        today={new Date(2026, 8, 1)}
        dayCount={1}
      />,
    );

    expect(screen.getByRole("columnheader", { name: /вторник/i })).toBeTruthy();
    expect(screen.queryByRole("columnheader", { name: /понедельник/i })).toBeNull();
    expect(screen.getByText("08:00–09:20")).toBeTruthy();
    expect(screen.queryByText("Сделано в MiddleGrade")).toBeNull();
  });

  it("shows an empty day message when that day has no lessons", () => {
    render(
      <ScheduleTable
        weekStart={new Date(2026, 8, 1)}
        lessons={[]}
        today={new Date(2026, 8, 1)}
        dayCount={1}
      />,
    );

    expect(screen.getByText("В этот день пар нет")).toBeTruthy();
  });
});
