import { describe, expect, it } from "vitest";
import { orderStatusLabel, orderStatusTone } from "@/utils/orderStatusLabel";

describe("orderStatusLabel", () => {
  it("labels Journal order statuses", () => {
    expect(orderStatusLabel("new")).toBe("Новый");
    expect(orderStatusLabel("rejected")).toBe("Отменён");
    expect(orderStatusLabel("closed")).toBe("Выдан");
  });
});

describe("orderStatusTone", () => {
  it("keeps new orders visually distinct from closed and rejected", () => {
    expect(orderStatusTone("new")).toBe("brand");
    expect(orderStatusTone("rejected")).toBe("bad");
    expect(orderStatusTone("closed")).toBe("good");
  });
});
