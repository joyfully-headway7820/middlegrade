import styles from "./Marks.module.scss";
import { BookCheck, CircleCheck, CircleX, Timer } from "lucide-react";

interface Props {
  date: string;
  number: number;
  control_work_mark: number | null;
  home_work_mark: number | null;
  lab_work_mark: number | null;
  class_work_mark: number | null;
  final_work_mark: number | null;
  teacher_name: string;
  spec_name: string;
  lesson_theme: string;
  status_was: number;
}

export default function Mark({
  date,
  number,
  home_work_mark,
  class_work_mark,
  lab_work_mark,
  control_work_mark,
  final_work_mark,
  teacher_name,
  spec_name,
  lesson_theme,
  status_was,
}: Props) {
  const transformDate = (date: string) => {
    return date.split("-").reverse().join(".");
  };

  return (
    <div className={styles.mark}>
      {status_was === 0 && (
        <div className={`${styles.mark__status} ${styles.red}`}>
          <CircleX size={25} />
        </div>
      )}
      {status_was === 1 && (
        <div className={`${styles.mark__status} ${styles.green}`}>
          <CircleCheck size={25} />
        </div>
      )}
      {status_was === 2 && (
        <div className={`${styles.mark__status} ${styles.yellow}`}>
          <Timer size={25} />
        </div>
      )}
      {status_was === null && (
        <div className={`${styles.mark__status} ${styles.grey}`}>
          <BookCheck size={25} />
        </div>
      )}
      <div className={styles.mark__left}>
        <div className={styles.mark__left__date}>{transformDate(date)}</div>
        <div className={styles.mark__left__number}>Пара {number + 1}</div>
      </div>

      <div className={styles.mark__marks}>
        {control_work_mark ? (
          <div className={`${styles.mark__marks__item} ${styles.green}`}>
            {control_work_mark}
          </div>
        ) : (
          ""
        )}
        {home_work_mark ? (
          <div className={`${styles.mark__marks__item} ${styles.red}`}>
            {home_work_mark}
          </div>
        ) : (
          ""
        )}
        {lab_work_mark ? (
          <div className={`${styles.mark__marks__item} ${styles.purple}`}>
            {lab_work_mark}
          </div>
        ) : (
          ""
        )}
        {class_work_mark ? (
          <div className={`${styles.mark__marks__item} ${styles.blue}`}>
            {class_work_mark}
          </div>
        ) : (
          ""
        )}
        {final_work_mark ? (
          <div className={`${styles.mark__marks__item} ${styles.grey}`}>
            {final_work_mark}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className={styles.mark__right}>
        <div className={styles.mark__right__spec}>{spec_name}</div>
        <div className={styles.mark__right__teacher}>{teacher_name}</div>
        <div className={styles.mark__right__theme}>{lesson_theme}</div>
      </div>
    </div>
  );
}
