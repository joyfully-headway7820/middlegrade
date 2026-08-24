import { ALWAYS_LISTED_SPECS } from "@/constants/constants";
import type { StudentExam, StudentVisit } from "@/types";
import { removeGroupPostfix } from "./removeGroupPostfix";

type Options = {
  visits: StudentVisit[];
  exams: StudentExam[];
  hideCompleted: boolean;
};

export const buildSpecList = ({ visits, exams, hideCompleted }: Options): string[] => {
  const names = new Set(visits.map((visit) => removeGroupPostfix(visit.spec_name)));

  if (hideCompleted) {
    const completed = new Set(
      exams
        .filter((exam) => exam.mark !== null && exam.mark !== 0)
        .map((exam) => removeGroupPostfix(exam.spec)),
    );

    for (const name of completed) {
      if (!ALWAYS_LISTED_SPECS.includes(name)) {
        names.delete(name);
      }
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b, "ru"));
};
