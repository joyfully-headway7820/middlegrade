import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { AppLayout } from "@/components/layout/AppLayout";

const renderLayout = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

  client.setQueryData(["homework", "counts"], []);

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<p>Контент</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("AppLayout", () => {
  afterEach(() => {
    localStorage.removeItem("mg-sidebar-collapsed");
  });

  it("keeps page content below the iPhone status bar", () => {
    renderLayout();

    expect(screen.getByRole("main").parentElement?.className).toContain(
      "safe-area-inset-top",
    );
  });

  it("collapses the desktop sidebar to icons", () => {
    renderLayout();

    fireEvent.click(screen.getByRole("button", { name: "Свернуть меню" }));

    expect(screen.getByRole("button", { name: "Развернуть меню" })).toBeTruthy();
  });

  it("puts feedback in the mobile header", () => {
    renderLayout();

    const links = screen.getAllByRole("link", { name: "Оставить обратную связь" });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(
      links.some((link) => link.closest("header")?.className.includes("lg:hidden")),
    ).toBe(true);
  });
});
