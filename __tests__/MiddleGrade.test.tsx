import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import MiddleGrade from "../src/components/MiddleGrade";
import { examsMockData, marksMockData } from "./mockData";

describe("MiddleGrade component", () => {
  it("should render MiddleGrade component with empty exams and empty data correctly", () => {
    render(<MiddleGrade data={[]} exams={[]} />);
  });
  it("should render MiddleGrade component with exams and empty data correctly", () => {
    render(<MiddleGrade data={[]} exams={examsMockData} />);
  });
  it("should render MiddleGrade component with data and empty exams correctly", () => {
    render(<MiddleGrade data={marksMockData} exams={[]} />);
  });
  it("should render MiddleGrade component with data and exams correctly", () => {
    render(<MiddleGrade data={marksMockData} exams={examsMockData} />);
  });
});
