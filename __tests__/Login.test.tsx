import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoginPage } from "@/pages/Login";

describe("LoginPage", () => {
  it("keeps the theme picker below the iPhone status bar", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <LoginPage />
      </QueryClientProvider>,
    );

    const picker = screen.getByRole("button", { name: "Тема оформления" });
    const offset = picker.closest("[class*='safe-area-inset-top']");

    expect(offset).not.toBeNull();
  });
});
