import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Segmented } from "@/components/ui/Controls";

describe("Segmented", () => {
  it("keeps short labels on one line", () => {
    render(
      <Segmented
        options={[
          { value: "group", label: "Группа" },
          { value: "stream", label: "Поток" },
        ]}
        value="group"
        onChange={() => undefined}
        ariaLabel="Область рейтинга"
      />,
    );

    const tab = screen.getByRole("tab", { name: "Группа" });
    expect(tab.textContent).toBe("Группа");
    expect(tab.className).toContain("whitespace-nowrap");
    expect(tab.className).toContain("sm:basis-0");
  });
});
