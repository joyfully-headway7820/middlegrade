import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityRow } from "@/components/dashboard/ActivityRow";
import type { ActivityEntry } from "@/types";

const entry = (overrides: Partial<ActivityEntry> = {}): ActivityEntry => ({
  date: "2026-08-25 13:51:58",
  action: 1,
  current_point: 1,
  point_types_id: 1,
  point_types_name: "DIAMOND",
  achievements_id: 1,
  achievements_name: "PAIR_VISIT",
  achievements_type: 1,
  badge: 0,
  old_competition: false,
  ...overrides,
});

describe("ActivityRow", () => {
  it("shows a market purchase as a debit", () => {
    render(
      <ul>
        <ActivityRow
          entry={entry({
            action: 0,
            current_point: 473,
            achievements_name: "MARKET_ORDER",
          })}
        />
      </ul>,
    );

    expect(screen.getByText("Покупка в маркете")).toBeTruthy();
    expect(screen.getByText("-473")).toBeTruthy();
    expect(screen.getByText("-473")).toHaveClass("text-bad");
  });

  it("shows a lesson visit as an accrual", () => {
    render(
      <ul>
        <ActivityRow entry={entry()} />
      </ul>,
    );

    expect(screen.getByText("+1")).toBeTruthy();
    expect(screen.getByText("+1")).toHaveClass("text-good");
  });
});
