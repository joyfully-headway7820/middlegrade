import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SchedulePage } from "@/pages/Schedule";
import { useAuthStore } from "@/store/auth";
import type { ScheduleLesson, UserInfo } from "@/types";

const lesson = (): ScheduleLesson => ({
  date: "2026-09-01",
  lesson: 1,
  started_at: "08:00:00",
  finished_at: "09:20:00",
  teacher_name: "Хамитов Илья Раильевич",
  subject_name: "ASP.NET",
  room_name: "Дистант 7",
});

const user = (): UserInfo => ({
  groups: [],
  manual_link: null,
  student_id: 1,
  current_group_id: 10,
  full_name: "Петров Пётр Петрович",
  achieves_count: 0,
  stream_id: 1,
  stream_name: "РПО",
  group_name: "9/1-РПО-23/2-72",
  level: 1,
  photo: "",
  gaming_points: [],
  spent_gaming_points: [],
  visibility: {},
  current_group_status: 1,
  birthday: "",
  last_date_visit: "",
  registration_date: "",
  gender: 1,
  study_form_short_name: "очная",
});

describe("SchedulePage preview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 2, 12));
    useAuthStore.setState({ user: user() });
  });

  afterEach(() => {
    vi.useRealTimers();
    useAuthStore.setState({ user: null });
  });

  it("opens a screenshot card for the current week", () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });
    const lessons = [lesson()];
    client.setQueryData(["schedule", "month", "2026-09-01"], lessons);
    client.setQueryData(["schedule", "range", "2026-08-31", "2026-09-06"], lessons);

    render(
      <QueryClientProvider client={client}>
        <SchedulePage />
      </QueryClientProvider>,
    );

    expect(screen.queryByRole("dialog", { name: "Превью расписания" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Превью" }));

    expect(screen.getByRole("dialog", { name: "Превью расписания" })).toBeTruthy();
    expect(screen.getByText("ASP.NET")).toBeTruthy();
    expect(screen.getByText("9/1-РПО-23/2-72")).toBeTruthy();
  });

  it("shows the week table in the regular week view", () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });
    const lessons = [lesson()];
    client.setQueryData(["schedule", "month", "2026-09-01"], lessons);
    client.setQueryData(["schedule", "range", "2026-08-31", "2026-09-06"], lessons);

    render(
      <QueryClientProvider client={client}>
        <SchedulePage />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Неделя" }));

    expect(screen.getByRole("columnheader", { name: /понедельник/i })).toBeTruthy();
    expect(screen.getByText("ASP.NET")).toBeTruthy();
    expect(screen.getByText("Хамитов Илья Раильевич")).toBeTruthy();
  });
});
