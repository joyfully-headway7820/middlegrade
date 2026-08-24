import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExamRecords } from "@/components/grades/ExamRecords";
import type { StudentExam } from "@/types";

const exam = (overrides: Partial<StudentExam> = {}): StudentExam => ({
  teacher: "Иванов И.И.",
  mark: 5,
  mark_type: 1,
  date: "2026-05-20",
  ex_file_name: null,
  id_file: null,
  exam_id: 7,
  file_path: null,
  comment_teach: null,
  need_access: 0,
  need_access_stud: null,
  comment_delete_file: null,
  spec: "Математика",
  ...overrides,
});

describe("ExamRecords", () => {
  it("renders a stacked list and a wrapping table for the same records", () => {
    render(<ExamRecords exams={[exam()]} />);

    expect(screen.getAllByText("Математика")).toHaveLength(2);
    expect(screen.getAllByText("Иванов И.И.")).toHaveLength(2);
    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByRole("table").className).not.toContain("min-w-3xl");
  });
});
