import "./Middlegrade.module.scss";
import Card from "../Card";
import styles from "./Middlegrade.module.scss";
import distributeData from "../../utils/distributeData.ts";
import { FIVE_GRADE_SYSTEM_DATE } from "../../constants/constants.ts";
import { IMarkResponse } from "../../@types";
import { countMiddle } from "../../utils/countMiddle.ts";

export default function MiddleGrade({ data }: { data: IMarkResponse[] }) {
  const marks = distributeData(data, FIVE_GRADE_SYSTEM_DATE);

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
      <Card
        text="Средний балл за практические"
        sum={countMiddle(marks.practicalsSum, marks.practicals)}
        color="card--deep-orange"
      />
    </div>
  );
}
