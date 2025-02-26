import { IDataElement } from "../../App.tsx";
import { toFive } from "../../utils/toFive.ts";

export interface IMarks {
  grades: number[];
  classWork: number[];
  controlWork: number[];
  homeWork: number[];
  labs: number[];
  gradeSum: number;
  classGradeSum: number;
  controlGradeSum: number;
  homeGradeSum: number;
  labGradeSum: number;
}

const distributeData = (
  data: IDataElement[],
  FIVE_GRADE_SYSTEM_DATE: Date,
): IMarks => {
  return data.reduce<IMarks>(
    (acc, element) => {
      const checkFive = (mark: number | null) => {
        if (!mark) return null;
        return new Date(element.date_visit) < FIVE_GRADE_SYSTEM_DATE
          ? toFive(mark)
          : mark;
      };

      const classMark = checkFive(element.class_work_mark);
      if (classMark) {
        acc.grades.push(classMark);
        acc.classWork.push(classMark);
        acc.gradeSum += classMark;
        acc.classGradeSum += classMark;
      }

      const controlMark = checkFive(element.control_work_mark);
      if (controlMark) {
        acc.grades.push(controlMark);
        acc.controlWork.push(controlMark);
        acc.gradeSum += controlMark;
        acc.controlGradeSum += controlMark;
      }

      const homeMark = checkFive(element.home_work_mark);
      if (homeMark) {
        acc.grades.push(homeMark);
        acc.homeWork.push(homeMark);
        acc.gradeSum += homeMark;
        acc.homeGradeSum += homeMark;
      }

      const labMark = checkFive(element.lab_work_mark);
      if (labMark) {
        acc.grades.push(labMark);
        acc.labs.push(labMark);
        acc.gradeSum += labMark;
        acc.labGradeSum += labMark;
      }

      return acc;
    },
    {
      grades: [],
      classWork: [],
      controlWork: [],
      homeWork: [],
      labs: [],
      gradeSum: 0,
      classGradeSum: 0,
      controlGradeSum: 0,
      homeGradeSum: 0,
      labGradeSum: 0,
    },
  );
};

export default distributeData;
