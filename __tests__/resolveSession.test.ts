import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api";
import type { UserInfo } from "@/types";
import { resolveSession } from "@/utils/resolveSession";

const student = (): UserInfo => ({
  groups: [],
  manual_link: null,
  student_id: 1,
  current_group_id: 10,
  full_name: "Иванов Иван Иванович",
  achieves_count: 0,
  stream_id: 1,
  stream_name: "РПО",
  group_name: "9/1-РПО-23/2-72",
  level: 1,
  photo: "",
  gaming_points: [],
  spent_gaming_points: [],
  visibility: {},
  current_group_status: 1,
  birthday: "",
  last_date_visit: "",
  registration_date: "",
  gender: 1,
  study_form_short_name: "очная",
});

describe("resolveSession", () => {
  it("uses the zustand user when it is already set", () => {
    const user = student();

    expect(resolveSession(user, { data: undefined, error: null }, true)).toBe(user);
  });

  it("falls back to a hydrated /auth/me payload", () => {
    const cached = student();

    expect(resolveSession(null, { data: cached, error: null }, true)).toBe(cached);
  });

  it("drops the session on a live 401 even if a cached profile is still around", () => {
    const cached = student();

    expect(
      resolveSession(
        cached,
        { data: cached, error: new ApiError(401, "Сессия истекла. Войдите снова.") },
        true,
      ),
    ).toBeNull();
  });

  it("keeps cached profile data when the device is offline", () => {
    const cached = student();

    expect(
      resolveSession(
        null,
        { data: cached, error: new ApiError(0, "Нет сети") },
        false,
      ),
    ).toBe(cached);
  });
});
