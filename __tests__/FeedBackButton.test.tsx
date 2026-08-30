import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeedBackButton } from "@/components/ui/FeedBackButton";

describe("FeedBackButton", () => {
  it("renders a compact header control", () => {
    render(<FeedBackButton variant="header" />);

    const link = screen.getByRole("link", { name: "Оставить обратную связь" });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/joyfully-headway7820/middlegrade/issues/new",
    );
    expect(link.className).not.toContain("fixed");
  });

  it("keeps the floating control off the phone layout", () => {
    render(<FeedBackButton />);

    const link = screen.getByRole("link", { name: "Оставить обратную связь" });
    expect(link.className).toContain("hidden");
    expect(link.className).toContain("lg:flex");
  });
});
