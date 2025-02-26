import { describe, expect, it } from "vitest";
import { marksMockData } from "./mockData";
import {
  distributeVisits,
  IVisits,
} from "../src/components/Visits/distributeVisits";

describe("Distribute Visits", () => {
  it("should distributeVisits with data and return IVisits object", () => {
    const result = distributeVisits(marksMockData);
    expect(result).toStrictEqual<IVisits>({
      studentWas: 4,
      studentLate: 2,
      studentWasnt: 1,
      wasPercent: 80,
      latePercent: 40,
      wasntPercent: 20,
    });
  });
  it("should distributeVisits with empty data and return IVisits object", () => {
    const result = distributeVisits([]);
    expect(result).toStrictEqual<IVisits>({
      studentWas: 0,
      studentLate: 0,
      studentWasnt: 0,
      wasPercent: 0,
      latePercent: 0,
      wasntPercent: 0,
    });
  });
});
