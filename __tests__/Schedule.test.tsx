import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SchedulePage } from "@/pages/Schedule";
import { useAuthStore } from "@/store/auth";
import type { ScheduleLesson, UserInfo } from "@/types";
import { drawScheduleImage } from "@/utils/drawScheduleImage";
import { saveScheduleImage } from "@/utils/saveScheduleImage";

vi.mock("@/utils/drawScheduleImage", () => ({
  drawScheduleImage: vi
    .fn()
    .mockResolvedValue(new Blob(["png"], { type: "image/png" })),
  readScheduleImageColors: () => ({
    canvas: "#080a12",
    surface: "#12141f",
    heading: "#f3f5fb",
    muted: "#8189a8",
    brand: "#7024f7",
    brandDeep: "#5f16dc",
    white: "#ffffff",
  }),
}));

vi.mock("@/utils/saveScheduleImage", () => ({
  saveScheduleImage: vi.fn().mockResolvedValue("downloaded"),
}));

const lesson = (): ScheduleLesson => ({
  date: "2026-09-01",
  lesson: 1,
  started_at: "08:00",
  finished_at: "09:20",
  teacher_name: "Андреев Андрей Андреевич",
  subject_name: "ASP.NET",
  room_name: "Онлайн 1",
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
  group_name: "1/1-РПО-00/1-01",
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

const renderPage = (client: QueryClient) =>
  render(
    <QueryClientProvider client={client}>
      <SchedulePage />
    </QueryClientProvider>,
  );

const seedWeek = (client: QueryClient, lessons: ScheduleLesson[]) => {
  client.setQueryData(["schedule", "month", "2026-09-01"], lessons);
  client.setQueryData(
    ["schedule", "range", "2026-08-31", "2026-09-06"],
    lessons,
  );
  client.setQueryData(
    ["schedule", "range", "2026-09-01", "2026-09-01"],
    lessons,
  );
  client.setQueryData(
    ["schedule", "range", "2026-09-02", "2026-09-02"],
    lessons,
  );
};

describe("SchedulePage", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 8, 2, 12));
    useAuthStore.setState({ user: user() });
    vi.mocked(drawScheduleImage).mockClear();
    vi.mocked(saveScheduleImage).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    useAuthStore.setState({ user: null });
  });

  it("saves an image instead of opening a preview dialog", async () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });
    seedWeek(client, [lesson()]);
    renderPage(client);

    expect(screen.queryByRole("dialog")).toBeNull();

    const camera = screen.getByRole("button", { name: "Сохранить расписание" });
    await waitFor(() => {
      expect(camera).not.toBeDisabled();
    });

    fireEvent.click(camera);

    await waitFor(() => {
      expect(saveScheduleImage).toHaveBeenCalledOnce();
    });
    expect(drawScheduleImage).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens a day dialog from the month grid", () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });
    seedWeek(client, [lesson()]);
    renderPage(client);

    fireEvent.click(screen.getByRole("button", { name: "2026-09-01, 1 пара" }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("ASP.NET")).toBeTruthy();
    expect(within(dialog).getByText("08:00–09:20")).toBeTruthy();
    expect(within(dialog).getByText("Онлайн 1")).toBeTruthy();
    expect(screen.getByText("1 сентября 2026 г.")).toBeTruthy();
  });

  it("closes the day dialog when the view changes", () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });
    seedWeek(client, [lesson()]);
    renderPage(client);

    fireEvent.click(screen.getByRole("button", { name: "2026-09-01, 1 пара" }));
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.click(screen.getByRole("tab", { name: "День" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the week table in the regular week view", () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });
    seedWeek(client, [lesson()]);
    renderPage(client);

    fireEvent.click(screen.getByRole("tab", { name: "Неделя" }));

    expect(
      screen.getByRole("columnheader", { name: /понедельник/i }),
    ).toBeTruthy();
    expect(screen.getByText("ASP.NET")).toBeTruthy();
    expect(screen.getByText("Андреев Андрей Андреевич")).toBeTruthy();
    expect(screen.queryByText("Сделано в MiddleGrade")).toBeNull();
  });

  it("shows a single-day table in the day view", () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });
    const todayLesson = { ...lesson(), date: "2026-09-02" };
    seedWeek(client, [lesson()]);
    client.setQueryData(
      ["schedule", "range", "2026-09-02", "2026-09-02"],
      [todayLesson],
    );
    renderPage(client);

    fireEvent.click(screen.getByRole("tab", { name: "День" }));

    expect(screen.getByRole("columnheader", { name: /среда/i })).toBeTruthy();
    expect(
      screen.queryByRole("columnheader", { name: /понедельник/i }),
    ).toBeNull();
    expect(screen.getByText("ASP.NET")).toBeTruthy();
    expect(screen.getByText("08:00–09:20")).toBeTruthy();
  });
});
