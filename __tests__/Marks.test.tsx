import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import Marks from "../src/components/Marks";
import { marks_1000, marks_10000, marks_2000 } from "./mockData";

describe("MiddleGrade component", () => {
  it("should render Marks with 1000 elements", () => {
    const startTime = new Date();
    render(<Marks marks={marks_1000} />);
    const endTime = new Date();

    const timeDiff = endTime.getTime() - startTime.getTime();
    console.log(`Time spent to render 1000 elements: ${timeDiff} ms`);
  });
  it("should render Marks with 2000 elements", () => {
    const startTime = new Date();
    render(<Marks marks={marks_2000} />);
    const endTime = new Date();

    const timeDiff = endTime.getTime() - startTime.getTime();
    console.log(`Time spent to render 2000 elements: ${timeDiff} ms`);
  });
  it("should render Marks with 10000 elements", () => {
    const startTime = new Date();
    render(<Marks marks={marks_10000} />);
    const endTime = new Date();

    const timeDiff = endTime.getTime() - startTime.getTime();
    console.log(`Time spent to render 10000 elements: ${timeDiff} ms`);
  });
});
