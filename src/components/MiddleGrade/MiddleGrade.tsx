import { IDataElement, IExamsElement } from "../../App";
import { toFive } from "../../utils/toFive.ts";
import "./Middlegrade.module.scss";
import Card from "../Card/Card.tsx";
import styles from "./Middlegrade.module.scss";
import distributeData from "./distributeData.ts";

const FIVE_GRADE_SYSTEM_DATE = new Date("2024-09-01");

export default function MiddleGrade({
  data,
  exams,
}: {
  data: IDataElement[];
  exams: IExamsElement[];
}) {
  const marks = distributeData(data, FIVE_GRADE_SYSTEM_DATE);

  const { examGrades, examSum } = exams.reduce(
    (acc, element) => {
      if (!element.date || !element.mark) return acc;

      const mark =
        new Date(element.date) < FIVE_GRADE_SYSTEM_DATE
          ? toFive(element.mark)
          : element.mark;

      if (mark) {
        acc.examGrades.push(mark);
        acc.examSum += mark;
      }
      return acc;
    },
    { examGrades: [] as number[], examSum: 0 },
  );

  function countMiddle(sum: number, arr: (number | null)[]): number {
    if (arr.length) {
      return +(sum / arr.length).toFixed(4);
    }
    return 0;
  }

  return (
    <div className={styles.middlegrade}>
      <Card
        text="Средний балл"
        sum={countMiddle(marks.gradeSum, marks.grades)}
        color="card--white"
      />
      <Card
        text="Средний балл за работу на паре"
        sum={countMiddle(marks.classGradeSum, marks.classWork)}
        color="card--blue"
      />
      <Card
        text="Средний балл за контрольные"
        sum={countMiddle(marks.controlGradeSum, marks.controlWork)}
        color="card--green"
      />
      <Card
        text="Средний балл за домашки"
        sum={countMiddle(marks.homeGradeSum, marks.homeWork)}
        color="card--red"
      />
      <Card
        text="Средний балл за лабы"
        sum={countMiddle(marks.labGradeSum, marks.labs)}
        color="card--purple"
      />
      {exams.length > 0 && (
        <Card
          text="Средний балл за экзамены"
          sum={countMiddle(examSum, examGrades)}
          color="card--orange"
        />
      )}
    </div>
  );
}
