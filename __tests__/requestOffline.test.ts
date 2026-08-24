import { afterEach, describe, expect, it } from "vitest";
import { ApiError, request } from "@/lib/api";

const setOnline = (value: boolean) => {
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    enumerable: true,
    get: () => value,
  });
};

describe("request", () => {
  afterEach(() => {
    setOnline(true);
  });

  it("fails fast with Нет сети when the browser is offline", async () => {
    setOnline(false);

    const error = await request("/auth/me").then(
      () => undefined,
      (cause: unknown) => cause,
    );

    expect(error).toBeInstanceOf(ApiError);
    if (error instanceof ApiError) {
      expect(error.status).toBe(0);
      expect(error.message).toBe("Нет сети");
    }
  });
});
