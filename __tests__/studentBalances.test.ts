import { describe, expect, it } from "vitest";
import { GamingPointTypes } from "@/constants/constants";
import { studentBalances } from "@/utils/studentBalances";

describe("studentBalances", () => {
  it("maps Journal diamond points to topcoins and coin points to gems", () => {
    expect(
      studentBalances([
        { new_gaming_point_types__id: GamingPointTypes.Gems, points: 12 },
        { new_gaming_point_types__id: GamingPointTypes.Coins, points: 4 },
      ]),
    ).toEqual({ coins: 12, gems: 4 });
  });

  it("returns zeros when the student has no wallet", () => {
    expect(studentBalances(undefined)).toEqual({ coins: 0, gems: 0 });
  });
});
