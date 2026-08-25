import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PurchaseRow } from "@/components/market/PurchaseRow";
import type { MarketPurchase } from "@/types";

const photo =
  "https://fs.top-academy.ru/api/v1/files/V-6f5FsAo-meC1IkA142JpNRyCLCNCXh";

const purchase = (overrides: Partial<MarketPurchase> = {}): MarketPurchase => ({
  id: 513,
  name: "Обложка для студенческого",
  date: "2026-08-25 13:51:58",
  photo,
  status: "new",
  cancellable: true,
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
    render(
      <PurchaseRow
        purchase={purchase()}
        onCancel={vi.fn()}
        pending={false}
        disabled={false}
      />,
    );

    expect(screen.getByText("Обложка для студенческого")).toBeTruthy();
    expect(screen.getByText(/№513/)).toBeTruthy();
    expect(screen.getByText("Новый")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Отменить" })).toBeTruthy();
  });

  it("does not cancel until the confirmation is accepted", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <PurchaseRow
        purchase={purchase()}
        onCancel={onCancel}
        pending={false}
        disabled={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Отменить" }));

    expect(onCancel).not.toHaveBeenCalled();
    const dialog = screen.getByRole("dialog", { name: "Отменить заказ" });
    expect(dialog).toHaveTextContent("Отменить заказ №513?");

    await user.click(within(dialog).getByRole("button", { name: "Назад" }));
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("cancels after the confirmation is accepted", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <PurchaseRow
        purchase={purchase()}
        onCancel={onCancel}
        pending={false}
        disabled={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Отменить" }));
    await user.click(screen.getByRole("button", { name: "Отменить заказ" }));

    expect(onCancel).toHaveBeenCalledWith(513);
  });

  it("hides cancel when the order is already closed", () => {
    render(
      <PurchaseRow
        purchase={purchase({
          id: 449,
          status: "closed",
          cancellable: false,
          name: "Заказ №449",
          items: [],
        })}
        onCancel={vi.fn()}
        pending={false}
        disabled={false}
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
        onCancel={vi.fn()}
        pending={false}
        disabled={false}
      />,
    );

    expect(screen.getByText("Обложка для студенческого")).toBeTruthy();
    expect(screen.getByText("Стикер ×2")).toBeTruthy();
  });
});
