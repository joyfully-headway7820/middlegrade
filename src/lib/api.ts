export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const BASE_URL = "/api";

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
};

const localizeMessage = (status: number, message: string): string => {
  if (
    message === "Not authenticated" ||
    (status === 401 && /not authenticated/i.test(message))
  ) {
    return "Сессия истекла. Войдите снова.";
  }

  return message;
};

export async function request<T>(
  path: string,
  { method = "GET", body, params, signal }: RequestOptions = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url, {
    method,
    credentials: "include",
    signal,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const raw =
      (payload as { error?: string } | null)?.error ??
      `Запрос завершился с кодом ${response.status}`;

    throw new ApiError(response.status, localizeMessage(response.status, raw));
  }

  return payload as T;
}
