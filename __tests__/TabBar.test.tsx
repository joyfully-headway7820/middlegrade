import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { TabBar } from "@/components/layout/TabBar";

const renderTabBar = (path: string, badges: Record<string, number> = {}) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <TabBar badges={badges} />
    </MemoryRouter>,
  );

describe("TabBar", () => {
  it("renders five tabs in the mobile order", () => {
    renderTabBar("/");

    const links = screen.getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Расписание",
      "Оценки",
      "Главная",
      "Задания",
      "Другое",
    ]);
  });

  it("marks home as the current page on the dashboard", () => {
    renderTabBar("/");

    expect(screen.getByRole("link", { name: "Главная" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("keeps the more tab current on secondary screens", () => {
    renderTabBar("/reviews");

    expect(screen.getByRole("link", { name: "Другое" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Главная" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows the homework badge", () => {
    renderTabBar("/homework", { "/homework": 4 });

    expect(screen.getByLabelText("Новых заданий: 4")).toHaveTextContent("4");
  });
});
