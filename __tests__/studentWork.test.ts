import { describe, expect, it } from "vitest";
import type { HomeworkItem } from "@/types";
import { studentWork } from "@/utils/studentWork";

const homework = (
  overrides: Partial<HomeworkItem> = {},
): HomeworkItem => ({
  id: 1,
  id_spec: 10,
  id_teach: 20,
  id_group: 30,
  fio_teach: "Борисихин Владислав Юрьевич",
  theme: "JS JQuery",
  completion_time: "2026-05-02 23:59:59",
  creation_time: "2026-01-10 12:00:00",
  overdue_time: "2026-05-09 23:59:59",
  filename: "task.pdf",
  file_path: "https://cdn.example/task.pdf",
  comment: "Сделайте слайдер",
  name_spec: "Язык сценариев JavaScript",
  status: 1,
  common_status: 1,
  cover_image: null,
  homework_stud: null,
  homework_comment: null,
  ...overrides,
});

describe("studentWork", () => {
  it("returns the uploaded file when present", () => {
    expect(
      studentWork(
        homework({
          homework_stud: {
            id: 100,
            filename: "work.zip",
            file_path: "https://cdn.example/work.zip",
            tmp_file: null,
            mark: 5,
            creation_time: "2026-04-20 12:00:00",
            stud_answer: "Пояснение",
            auto_mark: false,
          },
        }),
      ),
    ).toEqual({ kind: "file", url: "https://cdn.example/work.zip" });
  });

  it("returns the comment when the work was submitted as text", () => {
    expect(
      studentWork(
        homework({
          homework_stud: {
            id: 100,
            filename: null,
            file_path: "",
            tmp_file: null,
            mark: 5,
            creation_time: "2026-04-20 12:00:00",
            stud_answer: "Готово: https://codesandbox.io/p/sandbox/slider",
            auto_mark: false,
          },
        }),
      ),
    ).toEqual({
      kind: "comment",
      text: "Готово: https://codesandbox.io/p/sandbox/slider",
    });
  });

  it("falls back to a homework comment when there is no file or answer", () => {
    expect(
      studentWork(
        homework({
          homework_stud: {
            id: 100,
            filename: null,
            file_path: "  ",
            tmp_file: null,
            mark: 5,
            creation_time: "2026-04-20 12:00:00",
            stud_answer: null,
            auto_mark: false,
          },
          homework_comment: {
            text_comment: "Ответ в комментарии",
            attachment: null,
            attachment_path: null,
            date_updated: "2026-04-20 12:05:00",
          },
        }),
      ),
    ).toEqual({ kind: "comment", text: "Ответ в комментарии" });
  });

  it("returns none when nothing was submitted", () => {
    expect(studentWork(homework())).toEqual({ kind: "none" });
  });
});
