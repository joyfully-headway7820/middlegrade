import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { MorePage } from "@/pages/More";
import { useAuthStore } from "@/store/auth";
import type { UserInfo } from "@/types";

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
  gaming_points: [
    { new_gaming_point_types__id: 1, points: 12 },
    { new_gaming_point_types__id: 2, points: 4 },
  ],
  spent_gaming_points: [],
  visibility: {},
  current_group_status: 1,
  birthday: "",
  last_date_visit: "",
  registration_date: "",
  gender: 1,
  study_form_short_name: "очная",
});

const renderMore = () => {
  useAuthStore.setState({ user: user() });

  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <MorePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("MorePage", () => {
  afterEach(() => {
    useAuthStore.setState({ user: null });
  });

  it("shows the student identity, balances, and secondary links", () => {
    renderMore();

    expect(screen.getByText("Петров Пётр Петрович")).toBeTruthy();
    expect(screen.getByText("9/1-РПО-23/2-72")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Отзывы" })).toHaveAttribute(
      "href",
      "/reviews",
    );
    expect(screen.getByRole("link", { name: "Маркет" })).toHaveAttribute(
      "href",
      "/market",
    );
    expect(screen.getByRole("link", { name: "Оплата" })).toHaveAttribute(
      "href",
      "/payment",
    );
    expect(screen.getByText("Тема")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Выйти" })).toBeTruthy();
  });
});
