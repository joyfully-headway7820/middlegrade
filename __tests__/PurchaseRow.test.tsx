import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PurchaseRow } from "@/components/market/PurchaseRow";
import type { MarketPurchase } from "@/types";

const photo =
  "https://cdn.example/product.png";

const purchase = (overrides: Partial<MarketPurchase> = {}): MarketPurchase => ({
  id: 513,
  name: "Обложка для студенческого",
  date: "2026-08-25 13:51:58",
  photo,
  status: "new",
  items: [
    {
      id: 22,
      name: "Обложка для студенческого",
      count: 1,
      photo,
      coins: 473,
      gems: 490,
    },
  ],
  ...overrides,
});

describe("PurchaseRow", () => {
  it("shows the order contents, number, and status", () => {
    render(<PurchaseRow purchase={purchase()} />);

    expect(screen.getByText("Обложка для студенческого")).toBeTruthy();
    expect(screen.getByText(/№513/)).toBeTruthy();
    expect(screen.getByText("Новый")).toBeTruthy();
  });

  it("shows a closed order without a cancel control", () => {
    render(
      <PurchaseRow
        purchase={purchase({
          id: 449,
          status: "closed",
          name: "Заказ №449",
          items: [],
        })}
      />,
    );

    expect(screen.getByText("Выдан")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Отменить" })).toBeNull();
  });

  it("lists every product when the order has more than one item", () => {
    render(
      <PurchaseRow
        purchase={purchase({
          name: "Обложка для студенческого, Стикер ×2",
          items: [
            {
              id: 22,
              name: "Обложка для студенческого",
              count: 1,
              photo,
              coins: 473,
              gems: 490,
            },
            {
              id: 7,
              name: "Стикер",
              count: 2,
              photo: null,
              coins: 40,
              gems: 0,
            },
          ],
        })}
      />,
    );

    expect(screen.getByText("Обложка для студенческого")).toBeTruthy();
    expect(screen.getByText("Стикер ×2")).toBeTruthy();
  });
});
