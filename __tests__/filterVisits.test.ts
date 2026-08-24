import { describe, expect, it } from "vitest";
import { ALL_SPECS } from "@/constants/constants";
import { filterVisits } from "@/utils/filterVisits";
import type { StudentVisit } from "@/types";

const visit = (spec_name: string, date_visit: string): StudentVisit => ({
  date_visit,
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

const visits = [
  visit("Биология РПО", "2024-10-01"),
  visit("Технология разработки ГД 2", "2026-02-10"),
  visit("Технология разработки", "2025-05-20"),
];

describe("filterVisits", () => {
  it("returns everything for the all-subjects option", () => {
    expect(filterVisits({ visits, spec: ALL_SPECS, since: null })).toHaveLength(3);
  });

  it("matches a subject regardless of its group postfix", () => {
    const result = filterVisits({
      visits,
      spec: "Технология разработки",
      since: null,
    });

    expect(result).toHaveLength(2);
  });

  it("drops visits before the course start", () => {
    const result = filterVisits({
      visits,
      spec: ALL_SPECS,
      since: new Date("2025-08-31"),
    });

    expect(result).toEqual([visits[1]]);
  });
});
