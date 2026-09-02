import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EvaluateLessonGate } from "@/components/evaluate-lesson/EvaluateLessonGate";
import { useEvaluateLessonGate } from "@/hooks/useEvaluateLessonGate";
import * as api from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { EvaluateLessonQueueItem } from "@/types";

const baseItem: EvaluateLessonQueueItem = {
  key: "key-1",
  date_visit: "2026-09-01",
  fio_teach: "Иванов Иван Иванович",
  spec_name: "JavaScript",
  teach_photo: null,
};

const secondItem: EvaluateLessonQueueItem = {
  ...baseItem,
  key: "key-2",
  spec_name: "TypeScript",
};

const thirdItem: EvaluateLessonQueueItem = {
  ...baseItem,
  key: "key-3",
  spec_name: "Python",
};

const createClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
    },
  });

const bulkBody = (key: string) => ({
  key,
  mark_teach: 5,
  mark_lesson: 5,
  comment_teach: "",
  comment_lesson: "",
  tags_teach: [],
  tags_lesson: [],
});

const postCallsOf = (
  requestSpy: ReturnType<typeof vi.spyOn>,
) =>
  requestSpy.mock.calls.filter(
    ([path, options]) => path === "/feedback" && options?.method === "POST",
  );

function GateHarness() {
  const gate = useEvaluateLessonGate(true);

  if (gate.shouldShow) {
    return <EvaluateLessonGate gate={gate} />;
  }

  return <p>Журнал</p>;
}

const renderGate = (queue: EvaluateLessonQueueItem[] = [baseItem]) => {
  vi.spyOn(api, "request").mockImplementation(async (path, options) => {
    if (path === "/feedback/list") {
      return queue;
    }

    if (path === "/feedback" && options?.method === "POST") {
      return { ok: true };
    }

    throw new Error(`Unexpected request: ${path}`);
  });

  const client = createClient();

  return render(
    <QueryClientProvider client={client}>
      <GateHarness />
    </QueryClientProvider>,
  );
};

describe("EvaluateLessonGate", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("blocks teach stage without comment when mark is 3 or lower", async () => {
    renderGate();
    const user = userEvent.setup();

    await screen.findByRole("dialog", { name: "Оценка занятия" });
    await user.click(screen.getByRole("button", { name: "2 из 5" }));

    expect(screen.getByRole("button", { name: "Далее" })).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText("Расскажите, что можно улучшить"),
      "Нужно больше практики",
    );

    expect(screen.getByRole("button", { name: "Далее" })).toBeEnabled();
  });

  it("sends one POST with both marks after the lesson stage", async () => {
    const requestSpy = vi.spyOn(api, "request").mockImplementation(
      async (path, options) => {
        if (path === "/feedback/list") {
          return [baseItem];
        }

        if (path === "/feedback" && options?.method === "POST") {
          return { ok: true };
        }

        throw new Error(`Unexpected request: ${path}`);
      },
    );

    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <GateHarness />
      </QueryClientProvider>,
    );

    const user = userEvent.setup();

    await screen.findByRole("dialog", { name: "Оценка занятия" });
    await user.click(screen.getByRole("button", { name: "5 из 5" }));
    await user.click(screen.getByRole("button", { name: "Далее" }));
    await user.click(screen.getByRole("button", { name: "4 из 5" }));
    await user.click(screen.getByRole("button", { name: "Отправить" }));

    await waitFor(() => {
      expect(screen.getByText("Журнал")).toBeInTheDocument();
    });

    const postCalls = requestSpy.mock.calls.filter(
      ([path, options]) => path === "/feedback" && options?.method === "POST",
    );

    expect(postCalls).toHaveLength(1);
    expect(postCalls[0]?.[1]?.body).toEqual({
      key: "key-1",
      mark_teach: 5,
      mark_lesson: 4,
      comment_teach: "",
      comment_lesson: "",
      tags_teach: [],
      tags_lesson: [],
    });
  });

  it("sends 5/5 for all remaining items and closes the gate on CAP-4", async () => {
    const requestSpy = vi.spyOn(api, "request").mockImplementation(
      async (path, options) => {
        if (path === "/feedback/list") {
          return [baseItem, secondItem];
        }

        if (path === "/feedback" && options?.method === "POST") {
          return { ok: true };
        }

        throw new Error(`Unexpected request: ${path}`);
      },
    );

    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <GateHarness />
      </QueryClientProvider>,
    );

    const user = userEvent.setup();

    await screen.findByRole("dialog", { name: "Оценка занятия" });
    await user.click(
      screen.getByRole("button", { name: "Всё понравилось, закрыть" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Журнал")).toBeInTheDocument();
    });

    const postCalls = requestSpy.mock.calls.filter(
      ([path, options]) => path === "/feedback" && options?.method === "POST",
    );

    expect(postCalls).toHaveLength(2);
    expect(postCalls.map(([_, options]) => options?.body)).toEqual([
      {
        key: "key-1",
        mark_teach: 5,
        mark_lesson: 5,
        comment_teach: "",
        comment_lesson: "",
        tags_teach: [],
        tags_lesson: [],
      },
      {
        key: "key-2",
        mark_teach: 5,
        mark_lesson: 5,
        comment_teach: "",
        comment_lesson: "",
        tags_lesson: [],
        tags_teach: [],
      },
    ]);
  });

  it("dismisses the gate without POST on close or Escape", async () => {
    const requestSpy = vi.spyOn(api, "request").mockImplementation(
      async (path) => {
        if (path === "/feedback/list") {
          return [baseItem];
        }

        throw new Error(`Unexpected request: ${path}`);
      },
    );

    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <GateHarness />
      </QueryClientProvider>,
    );

    await screen.findByRole("dialog", { name: "Оценка занятия" });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.getByText("Журнал")).toBeInTheDocument();
    });

    const postCalls = requestSpy.mock.calls.filter(
      ([path, options]) => path === "/feedback" && options?.method === "POST",
    );

    expect(postCalls).toHaveLength(0);
  });

  it("does not mount the gate when the evaluate list is empty", async () => {
    vi.spyOn(api, "request").mockImplementation(async (path) => {
      if (path === "/feedback/list") {
        return [];
      }

      throw new Error(`Unexpected request: ${path}`);
    });

    render(
      <QueryClientProvider client={createClient()}>
        <GateHarness />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Журнал")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("dialog", { name: "Оценка занятия" }),
    ).not.toBeInTheDocument();
  });

  it("does not mount the gate when the evaluate list fails to load", async () => {
    vi.spyOn(api, "request").mockImplementation(async (path) => {
      if (path === "/feedback/list") {
        throw new ApiError(500, "Server error");
      }

      throw new Error(`Unexpected request: ${path}`);
    });

    render(
      <QueryClientProvider client={createClient()}>
        <GateHarness />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Журнал")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("dialog", { name: "Оценка занятия" }),
    ).not.toBeInTheDocument();
  });

  it("closes the gate immediately on CAP-4 and retries only failed keys after 1s", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    let key2PostAttempts = 0;

    const requestSpy = vi.spyOn(api, "request").mockImplementation(
      async (path, options) => {
        if (path === "/feedback/list") {
          return [baseItem, secondItem, thirdItem];
        }

        if (path === "/feedback" && options?.method === "POST") {
          const key = (options.body as { key: string }).key;

          if (key === "key-2") {
            key2PostAttempts += 1;
            throw new ApiError(500, "Server error");
          }

          return { ok: true };
        }

        throw new Error(`Unexpected request: ${path}`);
      },
    );

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTimeAsync });

    render(
      <QueryClientProvider client={createClient()}>
        <GateHarness />
      </QueryClientProvider>,
    );

    await screen.findByRole("dialog", { name: "Оценка занятия" });
    await user.click(
      screen.getByRole("button", { name: "Всё понравилось, закрыть" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Журнал")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("dialog", { name: "Оценка занятия" }),
    ).not.toBeInTheDocument();

    const firstWavePosts = postCallsOf(requestSpy);
    expect(firstWavePosts).toHaveLength(3);
    expect(firstWavePosts.map(([_, options]) => options?.body)).toEqual([
      bulkBody("key-1"),
      bulkBody("key-2"),
      bulkBody("key-3"),
    ]);
    expect(key2PostAttempts).toBe(1);

    await vi.advanceTimersByTimeAsync(1000);

    await waitFor(() => {
      expect(key2PostAttempts).toBe(2);
    });

    const allPosts = postCallsOf(requestSpy);
    expect(allPosts).toHaveLength(4);
    expect(allPosts[3]?.[1]?.body).toEqual(bulkBody("key-2"));
    expect(screen.getByText("Журнал")).toBeInTheDocument();
    expect(screen.queryByText("Server error")).not.toBeInTheDocument();
  });
});
