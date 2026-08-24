import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextField } from "@/components/ui/Controls";

describe("TextField", () => {
  it("reveals and hides a password field", async () => {
    const user = userEvent.setup();

    render(<TextField label="Пароль" name="password" type="password" />);

    const input = screen.getByLabelText("Пароль");
    expect(input).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Показать пароль" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Скрыть пароль" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Скрыть пароль" }));
    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Показать пароль" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("does not render a reveal control for a regular field", () => {
    render(<TextField label="Логин" name="username" />);

    expect(screen.queryByRole("button", { name: "Показать пароль" })).toBeNull();
  });
});
