import { describe, expect, it } from "vitest";
import { activityLabel } from "@/utils/activityLabel";
import type { ActivityEntry } from "@/types";

const entry = (name: string, pointsName = "DIAMOND"): ActivityEntry => ({
  date: "2026-07-02",
  action: 1,
  current_point: 1,
  point_types_id: 1,
  point_types_name: pointsName,
  achievements_id: 1,
  achievements_name: name,
  achievements_type: 1,
  badge: 0,
  old_competition: false,
});

describe("activityLabel", () => {
  it("maps mystat-api achievement keys to Journal Russian labels", () => {
    expect(activityLabel(entry("PAIR_VISIT"))).toBe("Посещение пары");
    expect(activityLabel(entry("EVALUATION_LESSON_MARK"))).toBe("Оценка занятия");
    expect(activityLabel(entry("HOMETASK_INTIME"))).toBe(
      "Своевременное выполнение домашнего задания",
    );
    expect(activityLabel(entry("ASSESMENT"))).toBe("Оценка");
  });

  it("falls back to the point type when the achievement key is empty", () => {
    expect(activityLabel(entry("", "DIAMOND"))).toBe("Топкоины");
    expect(activityLabel(entry("", "COIN"))).toBe("Топгемы");
  });

  it("prefers a live translations dictionary", () => {
    expect(
      activityLabel(entry("PAIR_VISIT"), { PAIR_VISIT: "Визит на пару" }),
    ).toBe("Визит на пару");
  });

  it("keeps an already translated string", () => {
    expect(activityLabel(entry("Посещение пары"))).toBe("Посещение пары");
  });
});
