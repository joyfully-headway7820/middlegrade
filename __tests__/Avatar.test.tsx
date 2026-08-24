import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "@/components/ui/Avatar";

describe("Avatar", () => {
  it("renders without crashing when name is null", () => {
    const { container } = render(<Avatar name={null} />);

    expect(container.querySelector("span[aria-hidden]")?.textContent).toBe("");
  });

  it("renders initials from a full name", () => {
    render(<Avatar name="Уразаев Тимур" />);

    expect(screen.getByText("УТ")).toBeTruthy();
  });
});
