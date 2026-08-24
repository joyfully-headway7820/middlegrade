import { describe, expect, it } from "vitest";
import { shouldRegisterServiceWorker } from "@/utils/shouldRegisterServiceWorker";

describe("shouldRegisterServiceWorker", () => {
  it("stays off on loopback so desktop HMR keeps working", () => {
    expect(shouldRegisterServiceWorker("localhost")).toBe(false);
    expect(shouldRegisterServiceWorker("127.0.0.1")).toBe(false);
  });

  it("turns on for LAN and production hosts", () => {
    expect(shouldRegisterServiceWorker("192.168.0.3")).toBe(true);
    expect(shouldRegisterServiceWorker("middlegrade.example")).toBe(true);
  });
});
