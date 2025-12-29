import { IMarkResponse } from "../@types";

export interface IVisits {
  studentWas: number;
  studentLate: number;
  studentWasnt: number;
  wasPercent: number;
  latePercent: number;
  wasntPercent: number;
}

export const distributeVisits = (data: IMarkResponse[]): IVisits => {
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

  function countPercent(arr: number[]): number {
    if (arr.length) {
      return +(arr.length / (data.length / 100)).toFixed(2);
    }
    return 0;
  }

  const wasPercent = countPercent(studentWas);
  const latePercent = countPercent(studentLate);
  const wasntPercent = countPercent(studentWasnt);

  return {
    studentWas: studentWas.length,
    studentLate: studentLate.length,
    studentWasnt: studentWasnt.length,
    wasPercent,
    latePercent,
    wasntPercent,
  };
};
