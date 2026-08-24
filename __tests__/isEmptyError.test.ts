import { describe, expect, it } from "vitest";
import { isEmptyError } from "@/utils/isEmptyError";

describe("isEmptyError", () => {
  it("hides the error screen when a cached payload is still there", () => {
    expect(isEmptyError({ isError: true, data: [{ id: 1 }] })).toBe(false);
  });

  it("shows the error screen only when nothing can be displayed", () => {
    expect(isEmptyError({ isError: true, data: undefined })).toBe(true);
    expect(isEmptyError({ isError: true, data: null })).toBe(true);
  });

  it("ignores successful queries", () => {
    expect(isEmptyError({ isError: false, data: undefined })).toBe(false);
  });
});
