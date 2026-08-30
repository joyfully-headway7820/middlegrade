import { describe, expect, it } from "vitest";
import {
  pageCountOf,
  toProduct,
  toPurchase,
  unwrapList,
} from "@/utils/normalizeMarket";

describe("unwrapList", () => {
  it("accepts a bare array and common envelopes", () => {
    expect(unwrapList([{ id: 1 }])).toHaveLength(1);
    expect(unwrapList({ data: [{ id: 1 }, { id: 2 }] })).toHaveLength(2);
    expect(unwrapList({ products: [{ id: 1 }] })).toHaveLength(1);
    expect(unwrapList(null)).toEqual([]);
  });

  it("reads Journal market envelopes and nested data", () => {
    expect(
      unwrapList({ total_count: 2, products_list: [{ id: 1 }, { id: 2 }] }),
    ).toHaveLength(2);
    expect(
      unwrapList({ total_count: 1, orders_list: [{ id: 9 }] }),
    ).toHaveLength(1);
    expect(
      unwrapList({ data: { products_list: [{ id: 4 }] } }),
    ).toEqual([{ id: 4 }]);
  });
});

describe("toProduct", () => {
  it("maps journal field aliases into a product", () => {
    expect(
      toProduct({
        product_id: "12",
        title: "Стикер",
        image_path: "https://fs.example/a.png",
        quantity: 3,
        price_coin: 40,
        price_diamond: 10,
        description: "На аватар",
      }),
    ).toEqual({
      id: 12,
      name: "Стикер",
      description: "На аватар",
      photo: "https://fs.example/a.png",
      stock: 3,
      coins: 40,
      gems: 10,
    });
  });

  it("drops rows without an id or a name", () => {
    expect(toProduct({ name: "X" })).toBeNull();
    expect(toProduct({ id: 1 })).toBeNull();
  });

  it("maps a Journal customer product with prices by point type", () => {
    expect(
      toProduct({
        id: 7,
        title: "Стикер",
        description: "На аватар",
        quantity: 3,
        url: "https://fs.example/a.png",
        prices: [
          { point_type_id: 1, points_sum: 40 },
          { point_type_id: 2, points_sum: 10 },
        ],
      }),
    ).toEqual({
      id: 7,
      name: "Стикер",
      description: "На аватар",
      photo: "https://fs.example/a.png",
      stock: 3,
      coins: 40,
      gems: 10,
    });
  });
});

describe("toPurchase", () => {
  it("maps a purchase row", () => {
    expect(
      toPurchase({
        order_id: 9,
        product_name: "Кружка",
        created_at: "2026-02-01",
      }),
    ).toEqual({
      id: 9,
      name: "Кружка",
      date: "2026-02-01",
      photo: null,
      status: "unknown",
      items: [],
    });
  });

  it("falls back to an order number when Journal sends only order metadata", () => {
    expect(
      toPurchase({
        id: 42,
        student_name: "Студент",
        created_at: "2025-03-17 12:00:00",
        status: 1,
      }),
    ).toEqual({
      id: 42,
      name: "Заказ №42",
      date: "2025-03-17 12:00:00",
      photo: null,
      status: "new",
      items: [],
    });
  });

  it("reads a Journal order list row without products", () => {
    expect(
      toPurchase({
        id: 513,
        student_name: "Петров Пётр Петрович",
        group_name: "1/1-РПО-00/1-01",
        created_at: "2026-08-25 13:51:58",
        status: 1,
      }),
    ).toEqual({
      id: 513,
      name: "Заказ №513",
      date: "2026-08-25 13:51:58",
      photo: null,
      status: "new",
      items: [],
    });
  });

  it("reads Journal order info with the purchased products", () => {
    const photo =
      "https://cdn.example/product.png";

    expect(
      toPurchase({
        updated_at: "2026-08-25 13:51:58",
        notes: "",
        products_list: [
          {
            id: 22,
            title: "Обложка для студенческого",
            quantity: 1,
            file_name: photo,
            url: photo,
            prices: [
              { point_type_id: 1, points_sum: 473, log: null },
              { point_type_id: 2, points_sum: 490, log: null },
            ],
          },
        ],
        id: 513,
        student_name: "Петров Пётр Петрович",
        group_name: "1/1-РПО-00/1-01",
        created_at: "2026-08-25 13:51:58",
        status: 1,
      }),
    ).toEqual({
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
    });
  });

  it("maps closed and rejected order statuses", () => {
    expect(toPurchase({ id: 449, status: 3 })?.status).toBe("closed");
    expect(toPurchase({ id: 307, status: 2 })?.status).toBe("rejected");
  });
});

describe("pageCountOf", () => {
  it("treats a larger total as an item count", () => {
    expect(pageCountOf(48, 12)).toBe(4);
  });

  it("treats a smaller or equal total as a page count", () => {
    expect(pageCountOf(3, 12)).toBe(3);
    expect(pageCountOf(1, 12)).toBe(1);
  });
});
