import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Marks from "@/components/Marks";
import { LESSONS_PER_PAGE } from "@/constants/constants";
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

  it("expands the full list on demand", async () => {
    const user = userEvent.setup();
    render(<Marks marks={visits(120)} />);

    await user.click(screen.getByRole("button", { name: "Показать все (120)" }));

    expect(rows()).toHaveLength(120);
    expect(rows()[0].textContent).toBe("Пара 120");
    expect(screen.queryByRole("navigation", { name: "Страницы" })).toBeNull();
  });

  it("keeps pagination hidden for short lists", () => {
    render(<Marks marks={visits(10)} />);

    expect(rows()).toHaveLength(10);
    expect(screen.queryByRole("navigation", { name: "Страницы" })).toBeNull();
  });
});
