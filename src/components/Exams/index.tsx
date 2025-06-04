import styles from "./Exams.module.scss";
import { toFive } from "../../utils/toFive";
import { FIVE_GRADE_SYSTEM_DATE } from "../../constants/constants.ts";
import { IExamsElement } from "../Stats";

export default function Exams({ data }: { data: IExamsElement[] }) {
  return (
    <div className={styles.exams}>
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
