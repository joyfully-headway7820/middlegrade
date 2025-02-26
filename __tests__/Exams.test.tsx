import React from "react";
import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import Exams from "../src/components/Exams/Exams";
import { examsMockData } from "./mockData";

describe("Exams component", () => {
  it("should render Exams component with empty data correctly", () => {
    render(<Exams data={[]} />);
  });
  it("should render Exams component with data correctly", () => {
    render(<Exams data={examsMockData} />);
  });
});
