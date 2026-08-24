import { describe, expect, it } from "vitest";
import type { HomeworkList } from "@/types";
import { nextHomeworkPage } from "@/utils/nextHomeworkPage";

const page = (current: number, totalPages: number): HomeworkList => ({
  page: current,
  totalPages,
  items: [],
});

describe("nextHomeworkPage", () => {
  it("returns the following page while journal still has a full chunk", () => {
    expect(nextHomeworkPage(page(1, 2))).toBe(2);
    expect(nextHomeworkPage(page(4, 5))).toBe(5);
  });

  it("stops when the current page is the last", () => {
    expect(nextHomeworkPage(page(1, 1))).toBeUndefined();
    expect(nextHomeworkPage(page(3, 3))).toBeUndefined();
  });
});
