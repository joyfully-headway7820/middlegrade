import { describe, expect, it } from "vitest";
import distributeData, {
  IMarks,
} from "../src/components/MiddleGrade/distributeData";
import { marksMockData } from "./mockData";
import { FIVE_GRADE_SYSTEM_DATE } from "../src/constants/constants";

describe("Distribute data", () => {
  it("should distributeData with data and return IMarks object", () => {
    const result = distributeData(marksMockData, FIVE_GRADE_SYSTEM_DATE);
    expect(result).toStrictEqual<IMarks>({
      grades: [5, 5, 3, 1, 3, 4, 5, 2, 5, 5, 4, 5, 5],
      classWork: [5, 3],
      controlWork: [5, 5],
      homeWork: [3, 4, 5, 5, 5],
      labs: [1, 2, 4, 5],
      gradeSum: 52,
      classGradeSum: 8,
      controlGradeSum: 10,
      homeGradeSum: 22,
      labGradeSum: 12,
    });
  });
  it("should distributeData with empty data and return IMarks object", () => {
    const result = distributeData([], FIVE_GRADE_SYSTEM_DATE);
    expect(result).toStrictEqual<IMarks>({
      grades: [],
      classWork: [],
      controlWork: [],
      homeWork: [],
      labs: [],
      gradeSum: 0,
      classGradeSum: 0,
      controlGradeSum: 0,
      homeGradeSum: 0,
      labGradeSum: 0,
    });
  });
});
