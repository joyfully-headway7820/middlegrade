import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { OfflineBanner } from "@/components/layout/OfflineBanner";

const setOnline = (value: boolean) => {
  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    enumerable: true,
    get: () => value,
  });
};

describe("OfflineBanner", () => {
  afterEach(() => {
    setOnline(true);
  });

  it("stays out of the way while the browser reports a network", () => {
    setOnline(true);
    render(<OfflineBanner />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("explains that the last saved journal data is on screen", () => {
    setOnline(false);
    render(<OfflineBanner />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Нет сети. Показаны сохранённые данные.",
    );
  });
});
