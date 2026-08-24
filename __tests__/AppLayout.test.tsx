import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
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
  it("keeps page content below the iPhone status bar", () => {
    renderLayout();

    expect(screen.getByRole("main").parentElement?.className).toContain(
      "safe-area-inset-top",
    );
  });
});
