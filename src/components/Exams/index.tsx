import styles from "./Exams.module.scss";
import { toFive } from "../../utils/toFive";
import { FIVE_GRADE_SYSTEM_DATE } from "../../constants/constants.ts";
import { IExamsElement } from "../../@types";
import { countMiddle } from "../../utils/countMiddle.ts";

export default function Exams({ data }: { data: IExamsElement[] }) {
  const { examArray, examSum } = data.reduce(
    (acc, element) => {
      if (!element.date || !element.mark) return acc;

      const mark =
        new Date(element.date) < FIVE_GRADE_SYSTEM_DATE
          ? toFive(element.mark)
          : element.mark;

      if (mark) {
        acc.examArray.push(mark);
        acc.examSum += mark;
      }
      return acc;
    },
    { examArray: [] as number[], examSum: 0 },
  );

  const examsMiddleGrade = countMiddle(examSum, examArray);
  return (
    <div className={styles.exams}>
      <div className={styles.exams__middlegrade}>
        Средняя: {examsMiddleGrade}
      </div>
      {data.map(
        (element) =>
          element.date && (
            <div key={element.exam_id} className={styles.exams__element}>
              <div className={styles.exams__name}>{element.spec}</div>
              <div className={styles.exams__grade}>
                {new Date(element.date) <= FIVE_GRADE_SYSTEM_DATE
                  ? toFive(element.mark)
                  : element.mark}
              </div>
              <div className={styles.exams__date}>{element.date}</div>
            </div>
          ),
      )}
    </div>
  );
}
