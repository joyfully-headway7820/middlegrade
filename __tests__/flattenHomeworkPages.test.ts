import { describe, expect, it } from "vitest";
import type { HomeworkItem, HomeworkList } from "@/types";
import { flattenHomeworkPages } from "@/utils/flattenHomeworkPages";

const item = (id: number): HomeworkItem => ({
  id,
  id_spec: 0,
  id_teach: 0,
  id_group: 0,
  fio_teach: "",
  theme: "",
  completion_time: "",
  creation_time: "",
  overdue_time: "",
  filename: null,
  file_path: "",
  comment: "",
  name_spec: "",
  status: 1,
  common_status: null,
  cover_image: null,
  homework_stud: null,
  homework_comment: null,
});

const page = (ids: number[]): HomeworkList => ({
  page: 1,
  totalPages: 1,
  items: ids.map(item),
});

describe("flattenHomeworkPages", () => {
  it("concatenates pages in order", () => {
    const items = flattenHomeworkPages([page([1, 2]), page([3, 4])]);

    expect(items.map((entry) => entry.id)).toEqual([1, 2, 3, 4]);
  });

  it("keeps the first copy when the same assignment appears twice", () => {
    const first = item(2);
    first.theme = "first";
    const second = item(2);
    second.theme = "second";

    const items = flattenHomeworkPages([
      { page: 1, totalPages: 2, items: [item(1), first] },
      { page: 2, totalPages: 2, items: [second, item(3)] },
    ]);

    expect(items.map((entry) => entry.id)).toEqual([1, 2, 3]);
    expect(items[1]?.theme).toBe("first");
  });
});
