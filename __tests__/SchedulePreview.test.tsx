import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SchedulePreview } from "@/components/schedule/SchedulePreview";
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

const lessons: ScheduleLesson[] = [
  lesson({ date: "2026-09-01", subject_name: "ASP.NET" }),
  lesson({
    date: "2026-09-02",
    subject_name: "WPF",
    room_name: "207 Фабричка",
  }),
];

describe("SchedulePreview", () => {
  it("renders a week table with every day and lesson cells", () => {
    render(
      <SchedulePreview
        groupName="9/1-РПО-23/2-72"
        rangeLabel="31 августа — 6 сентября"
        weekStart={weekStart}
        lessons={lessons}
        today={new Date(2026, 8, 2)}
        pending={false}
        onClose={vi.fn()}
      />,
    );

    const dialog = screen.getByRole("dialog", { name: "Превью расписания" });
    expect(dialog).toBeTruthy();
    expect(screen.getByText("9/1-РПО-23/2-72")).toBeTruthy();
    expect(screen.getByText("31 августа — 6 сентября")).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: /понедельник/i })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: /воскресенье/i })).toBeTruthy();
    expect(screen.getByRole("rowheader", { name: "1" })).toBeTruthy();
    expect(screen.getByText("ASP.NET")).toBeTruthy();
    expect(screen.getByText("WPF")).toBeTruthy();
    expect(screen.getByText("Дистант 7")).toBeTruthy();
    expect(screen.getByText("207 Фабричка")).toBeTruthy();
    expect(screen.getAllByText("Хамитов Илья Раильевич")).toHaveLength(2);
  });

  it("closes from the toolbar without putting chrome on the card", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <SchedulePreview
        groupName="9/1-РПО-23/2-72"
        rangeLabel="31 августа — 6 сентября"
        weekStart={weekStart}
        lessons={lessons}
        today={new Date(2026, 8, 2)}
        pending={false}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows an empty week on the card itself", () => {
    render(
      <SchedulePreview
        groupName={null}
        rangeLabel="31 августа — 6 сентября"
        weekStart={weekStart}
        lessons={[]}
        today={new Date(2026, 8, 2)}
        pending={false}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("На этой неделе пар нет")).toBeTruthy();
  });
});
