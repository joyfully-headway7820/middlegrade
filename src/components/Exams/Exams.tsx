import { IExams } from "../../App";
import styles from "./Exams.module.scss";
import { toFive } from "../../utils/toFive";

export default function Exams({ data }: IExams) {
  return (
    <div className={styles.exams}>
      {data.map(
        (element) =>
          element.date && (
            <div className={styles.exams__element}>
              <div className={styles.exams__name}>{element.spec}</div>
              <div className={styles.exams__grade}>
                {element.date <= "2024-09-01"
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
