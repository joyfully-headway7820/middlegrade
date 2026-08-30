import { describe, expect, it } from "vitest";
import {
  SCHEDULE_IMAGE_CREDIT,
  SCHEDULE_IMAGE_SITE,
  SCHEDULE_IMAGE_SITE_URL,
  scheduleImageFileName,
  wrapCanvasText,
} from "@/utils/scheduleImage";

describe("scheduleImage", () => {
  it("keeps the public credit line and site", () => {
    expect(SCHEDULE_IMAGE_CREDIT).toBe("Сделано в MiddleGrade");
    expect(SCHEDULE_IMAGE_SITE).toBe("middlegrade.vercel.app");
    expect(SCHEDULE_IMAGE_SITE_URL).toBe("https://middlegrade.vercel.app");
  });

  it("names a day file without a range suffix", () => {
    expect(scheduleImageFileName("2026-09-01", "2026-09-01")).toBe(
      "raspisanie-2026-09-01.png",
    );
  });

  it("names a week file with both dates", () => {
    expect(scheduleImageFileName("2026-08-31", "2026-09-06")).toBe(
      "raspisanie-2026-08-31-2026-09-06.png",
    );
  });

  it("wraps a long subject into several lines", () => {
    const lines = wrapCanvasText(
      (text) => text.length * 8,
      "Разработка веб-приложений с использованием технологий ASP.NET и AJAX",
      160,
    );

    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join(" ")).toContain("ASP.NET");
  });

  it("breaks a word that is wider than the column", () => {
    const lines = wrapCanvasText((text) => text.length * 10, "обеспечение", 50);

    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join("")).toBe("обеспечение");
  });
});
