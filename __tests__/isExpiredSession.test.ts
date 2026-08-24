import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api";
import { isExpiredSession } from "@/utils/isExpiredSession";

describe("isExpiredSession", () => {
  it("treats a 401 as a dead session only while online", () => {
    expect(isExpiredSession(new ApiError(401, "Сессия истекла. Войдите снова."), true)).toBe(
      true,
    );
  });

  it("keeps the local session when the failure is offline or unrelated", () => {
    expect(isExpiredSession(new ApiError(401, "Сессия истекла. Войдите снова."), false)).toBe(
      false,
    );
    expect(isExpiredSession(new ApiError(0, "Нет сети"), true)).toBe(false);
    expect(isExpiredSession(null, true)).toBe(false);
  });
});
