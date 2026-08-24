import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemePicker } from "@/components/layout/ThemePicker";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { useThemeStore } from "@/store/theme";

describe("ThemePicker", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    useThemeStore.setState({ preference: "system" });
  });

  it("stores an explicit light preference", async () => {
    const user = userEvent.setup();

    render(<ThemePicker />);

    await user.click(screen.getByRole("button", { name: "Тема оформления" }));
    await user.click(screen.getByRole("option", { name: "Светлая" }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("stores system as the follow-OS preference", async () => {
    const user = userEvent.setup();

    render(<ThemePicker />);

    await user.click(screen.getByRole("button", { name: "Тема оформления" }));
    await user.click(screen.getByRole("option", { name: "Системная" }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("system");
  });
});
