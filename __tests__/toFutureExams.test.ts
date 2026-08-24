import { describe, expect, it } from "vitest";
import { toFutureExams } from "@/utils/toFutureExams";

describe("toFutureExams", () => {
  it("maps Journal aliases, keeps the subject, and sorts soonest first", () => {
    expect(
      toFutureExams([
        {
          spec_name: "Математика",
          teacher_name: "Петров П.П.",
          exam_date: "2026-06-20 00:00:00",
          exam_name: "Экзамен",
        },
        {
          spec: "Базы данных",
          teacher: "Иванов И.И.",
          date: "15.06.2026",
          exam: "Зачёт",
        },
      ]),
    ).toEqual([
      {
        spec: "Базы данных",
        teacher: "Иванов И.И.",
        date: "2026-06-15",
        exam: "Зачёт",
      },
      {
        spec: "Математика",
        teacher: "Петров П.П.",
        date: "2026-06-20",
        exam: "Экзамен",
      },
    ]);
  });

  it("unwraps a data envelope and drops rows without a subject", () => {
    expect(
      toFutureExams({
        data: [{ spec: "Физика", date: "2026-09-01" }, { teacher: "Сидоров" }, null],
      }),
    ).toEqual([
      {
        spec: "Физика",
        teacher: null,
        date: "2026-09-01",
        exam: null,
      },
    ]);
  });

  it("returns an empty list for junk payloads", () => {
    expect(toFutureExams(null)).toEqual([]);
    expect(toFutureExams({})).toEqual([]);
    expect(toFutureExams("nope")).toEqual([]);
  });
});
