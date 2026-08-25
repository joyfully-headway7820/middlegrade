import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/market/ProductCard";
import type { MarketProduct } from "@/types";

const product = (overrides: Partial<MarketProduct> = {}): MarketProduct => ({
  id: 1,
  name: "Стикерпак",
  description: "Набор наклеек",
  photo: "https://cdn.example/sticker.png",
  stock: 4,
  coins: 50,
  gems: 0,
  ...overrides,
});

describe("ProductCard", () => {
  it("opens a dialog with the product photo when the thumbnail is clicked", async () => {
    const user = userEvent.setup();
    const photo = "https://cdn.example/sticker.png";

    render(
      <ProductCard
        item={product({ photo })}
        onBuy={vi.fn()}
        pending={false}
        disabled={false}
      />,
    );

    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Открыть фото: Стикерпак" }));

    const dialog = screen.getByRole("dialog", { name: "Стикерпак" });
    expect(within(dialog).getByRole("img", { name: "Стикерпак" })).toHaveAttribute(
      "src",
      photo,
    );
  });

  it("does not render a photo control when the product has no photo", () => {
    render(
      <ProductCard
        item={product({ photo: null })}
        onBuy={vi.fn()}
        pending={false}
        disabled={false}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Открыть фото: Стикерпак" }),
    ).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the photo dialog on Escape", async () => {
    const user = userEvent.setup();

    render(
      <ProductCard
        item={product()}
        onBuy={vi.fn()}
        pending={false}
        disabled={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Открыть фото: Стикерпак" }));
    expect(screen.getByRole("dialog", { name: "Стикерпак" })).toBeTruthy();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not buy until the confirmation is accepted", async () => {
    const user = userEvent.setup();
    const onBuy = vi.fn();

    render(
      <ProductCard
        item={product()}
        onBuy={onBuy}
        pending={false}
        disabled={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Купить" }));

    expect(onBuy).not.toHaveBeenCalled();
    expect(
      screen.getByRole("dialog", { name: "Подтвердить покупку" }),
    ).toHaveTextContent("Стикерпак");

    await user.click(screen.getByRole("button", { name: "Отмена" }));

    expect(onBuy).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("dialog", { name: "Подтвердить покупку" }),
    ).toBeNull();
  });

  it("buys after the confirmation is accepted", async () => {
    const user = userEvent.setup();
    const onBuy = vi.fn();

    render(
      <ProductCard
        item={product({ id: 22, name: "Обложка для студенческого" })}
        onBuy={onBuy}
        pending={false}
        disabled={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Купить" }));
    await user.click(screen.getByRole("button", { name: "Подтвердить" }));

    expect(onBuy).toHaveBeenCalledWith(22);
  });
});
