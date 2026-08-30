import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaChart } from "@/components/ui/AreaChart";

const data = [
  { label: "февр", value: null },
  { label: "март", value: 5 },
  { label: "апр", value: 5 },
  { label: "май", value: 5 },
  { label: "июнь", value: 5 },
  { label: "июль", value: null },
  { label: "авг", value: null },
];

describe("AreaChart", () => {
  it("plots the filled span and keeps the last month in the caption", () => {
    render(
      <AreaChart
        data={data}
        color="#a78bfa"
        unit="балл"
        ariaLabel="Средний балл по месяцам"
      />,
    );

    expect(screen.getByText("май")).toBeTruthy();
    expect(screen.queryByText("февр")).toBeNull();
    expect(screen.queryByText("авг")).toBeNull();
    expect(screen.getByText("июнь: 5 балл")).toBeTruthy();
    expect(screen.queryByText("Максимум — 5")).toBeNull();
  });

  it("shows a cursor bubble for the hovered month and leaves the caption alone", () => {
    render(
      <AreaChart
        data={data}
        color="#a78bfa"
        unit="балл"
        ariaLabel="Средний балл по месяцам"
      />,
    );

    const svg = screen.getByRole("img", { name: "Средний балл по месяцам" });
    const columns = svg.querySelectorAll("rect");

    fireEvent.mouseEnter(columns[1] as SVGRectElement, {
      clientX: 120,
      clientY: 40,
    });

    expect(screen.getByRole("tooltip").textContent).toBe("апр: 5 балл");
    expect(screen.getByText("июнь: 5 балл")).toBeTruthy();
  });
});
