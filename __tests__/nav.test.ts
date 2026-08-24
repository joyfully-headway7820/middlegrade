import { describe, expect, it } from "vitest";
import { isMorePath, TAB_ITEMS } from "@/components/layout/nav";

describe("TAB_ITEMS", () => {
  it("lists mobile tabs left to right", () => {
    expect(TAB_ITEMS.map((item) => item.label)).toEqual([
      "Расписание",
      "Оценки",
      "Главная",
      "Задания",
      "Другое",
    ]);
  });

  it("marks home as the featured tab", () => {
    expect(TAB_ITEMS.find((item) => item.to === "/")?.featured).toBe(true);
  });
});

describe("isMorePath", () => {
  it("treats secondary screens as the more tab", () => {
    expect(isMorePath("/more")).toBe(true);
    expect(isMorePath("/reviews")).toBe(true);
    expect(isMorePath("/market")).toBe(true);
    expect(isMorePath("/payment")).toBe(true);
  });

  it("leaves primary tabs alone", () => {
    expect(isMorePath("/")).toBe(false);
    expect(isMorePath("/grades")).toBe(false);
    expect(isMorePath("/schedule")).toBe(false);
    expect(isMorePath("/homework")).toBe(false);
  });
});
