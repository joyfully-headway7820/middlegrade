import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Marks from "@/components/Marks";
import { LESSONS_LOAD_MORE, LESSONS_PER_PAGE } from "@/constants/constants";
import type { StudentVisit } from "@/types";

const visits = (count: number): StudentVisit[] =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2023, 8, 4 + index));
    const iso = date.toISOString().slice(0, 10);

    return {
      date_visit: iso,
      lesson_number: (index % 6) + 1,
      status_was: index % 3,
      spec_id: index,
      teacher_name: "Андреев Андрей Андреевич",
      spec_name: "Технология разработки программного обеспечения",
      lesson_theme: "Тема занятия",
      control_work_mark: null,
      home_work_mark: 5,
      lab_work_mark: null,
      class_work_mark: null,
      practical_work_mark: null,
      final_work_mark: null,
    };
  });

const rows = () => screen.getAllByText(/^Пара \d+$/);

describe("Marks", () => {
  it("shows the latest lessons first", () => {
    render(<Marks marks={visits(120)} />);

    expect(rows()).toHaveLength(LESSONS_PER_PAGE);
    expect(rows()[0].textContent).toBe("Пара 120");
    expect(screen.getByText("01.01.2024")).toBeTruthy();
  });

  it("navigates between pages", async () => {
    const user = userEvent.setup();
    render(<Marks marks={visits(120)} />);

    await user.click(screen.getByRole("button", { name: "3" }));

    expect(rows()).toHaveLength(LESSONS_PER_PAGE);
    expect(rows()[0].textContent).toBe("Пара 80");
  });

  it("loads fifty more lessons from the current page", async () => {
    const user = userEvent.setup();
    render(<Marks marks={visits(120)} />);

    await user.click(screen.getByRole("button", { name: "Показать ещё" }));

    expect(rows()).toHaveLength(LESSONS_PER_PAGE + LESSONS_LOAD_MORE);
    expect(rows()[0].textContent).toBe("Пара 120");
  });

  it("hides the load more button once the tail is shown", async () => {
    const user = userEvent.setup();
    render(<Marks marks={visits(45)} />);

    await user.click(screen.getByRole("button", { name: "Показать ещё" }));

    expect(rows()).toHaveLength(45);
    expect(screen.queryByRole("button", { name: "Показать ещё" })).toBeNull();
  });

  it("keeps pagination hidden for short lists", () => {
    render(<Marks marks={visits(10)} />);

    expect(rows()).toHaveLength(10);
    expect(screen.queryByRole("navigation", { name: "Страницы" })).toBeNull();
  });
});
