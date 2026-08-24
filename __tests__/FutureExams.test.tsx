import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FutureExams } from "@/components/dashboard/FutureExams";
import type { FutureExam } from "@/types";

const exam = (): FutureExam => ({
  spec: "Базы данных",
  teacher: "Иванов И.И.",
  date: "2026-06-15",
  exam: "Зачёт",
});

const renderExams = (items: FutureExam[]) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

  client.setQueryData(["dashboard", "exams"], items);

  return render(
    <QueryClientProvider client={client}>
      <FutureExams />
    </QueryClientProvider>,
  );
};

describe("FutureExams", () => {
  it("lists assigned exams with teacher, type, and date", () => {
    renderExams([exam()]);

    expect(screen.getByText("Назначенные экзамены")).toBeTruthy();
    expect(screen.getByText("1 экзамен")).toBeTruthy();
    expect(screen.getByText("Базы данных")).toBeTruthy();
    expect(screen.getByText("Иванов И.И.")).toBeTruthy();
    expect(screen.getByText("Зачёт")).toBeTruthy();
  });

  it("renders nothing when Journal has nothing upcoming", () => {
    const { container } = renderExams([]);

    expect(screen.queryByText("Назначенные экзамены")).toBeNull();
    expect(container).toBeEmptyDOMElement();
  });
});
