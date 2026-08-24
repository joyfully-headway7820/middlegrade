import type { StudentVisit } from "@/types";
import { ratioPercent } from "./ratioPercent";

export interface IVisits {
  studentWas: number;
  studentLate: number;
  studentWasnt: number;
  wasPercent: number;
  latePercent: number;
  wasntPercent: number;
}

export const distributeVisits = (data: StudentVisit[]): IVisits => {
  const studentWas: number[] = [];
  const studentLate: number[] = [];
  const studentWasnt: number[] = [];

  data.forEach((element, i) => {
    switch (element.status_was) {
      case 0:
        studentWasnt.push(i);
        break;
      case 2:
        studentWas.push(i);
        studentLate.push(i);
        break;
      default:
        studentWas.push(i);
        break;
    }
  });

  return {
    studentWas: studentWas.length,
    studentLate: studentLate.length,
    studentWasnt: studentWasnt.length,
    wasPercent: ratioPercent(studentWas.length, data.length),
    latePercent: ratioPercent(studentLate.length, data.length),
    wasntPercent: ratioPercent(studentWasnt.length, data.length),
  };
};
