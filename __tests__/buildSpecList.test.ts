import { describe, expect, it } from "vitest";
import { buildSpecList } from "@/utils/buildSpecList";
import type { StudentExam, StudentVisit } from "@/types";

const visit = (spec_name: string): StudentVisit => ({
  date_visit: "2026-02-10",
  lesson_number: 1,
  status_was: 1,
  spec_id: 1,
  teacher_name: "Преподаватель",
  spec_name,
  lesson_theme: "Тема",
  control_work_mark: null,
  home_work_mark: null,
  lab_work_mark: null,
  class_work_mark: null,
  practical_work_mark: null,
  final_work_mark: null,
});

const exam = (spec: string, mark: number | null): StudentExam => ({
  teacher: "Преподаватель",
  mark,
  mark_type: 1,
  date: "2025-06-20",
  ex_file_name: null,
  id_file: null,
  exam_id: 1,
  file_path: null,
  comment_teach: null,
  need_access: 0,
  need_access_stud: null,
  comment_delete_file: null,
  spec,
});

describe("buildSpecList", () => {
  const visits = [
    visit("Биология РПО"),
    visit("Биология РПО"),
    visit("Основы алгоритмизации ГД 2"),
    visit("Физическая культура РПО"),
    visit("Технология разработки"),
  ];

  it("collapses group postfixes and deduplicates", () => {
    expect(buildSpecList({ visits, exams: [], hideCompleted: false })).toEqual([
      "Биология",
      "Основы алгоритмизации",
      "Технология разработки",
      "Физическая культура",
    ]);
  });

  it("hides subjects with a passed exam", () => {
    const list = buildSpecList({
      visits,
      exams: [exam("Биология РПО", 5)],
      hideCompleted: true,
    });

    expect(list).not.toContain("Биология");
    expect(list).toContain("Технология разработки");
  });

  it("keeps subjects without a mark in the exam record", () => {
    const list = buildSpecList({
      visits,
      exams: [exam("Технология разработки", 0), exam("Основы алгоритмизации ГД 2", null)],
      hideCompleted: true,
    });

    expect(list).toContain("Технология разработки");
    expect(list).toContain("Основы алгоритмизации");
  });

  it("always keeps long-running subjects", () => {
    const list = buildSpecList({
      visits,
      exams: [exam("Физическая культура РПО", 5)],
      hideCompleted: true,
    });

    expect(list).toContain("Физическая культура");
  });
});
