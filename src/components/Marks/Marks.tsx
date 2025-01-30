import { IDataElement } from "../../App.tsx";
import styles from "./Marks.module.scss";
import React from "react";
import Mark from "./Mark.tsx";
import UpButton from "../UpButton/UpButton.tsx";
import activeSpecStore from "../../store/activeSpec.ts";

interface Props {
  marks: IDataElement[];
}

export default function Marks({ marks }: Props) {
  const [showAll, setShowAll] = React.useState<boolean>(false);
  let reversedMarks = React.useMemo(
    () => [...marks].reverse(),
    [marks, showAll],
  ).map((mark, index) => ({
    ...mark,
    index,
  }));

  const { activeSpec } = activeSpecStore();
  const isAll = activeSpec === "Все предметы";

  if (isAll && !showAll) {
    reversedMarks = reversedMarks.slice(marks.length - 50, marks.length);
  }

  return (
    <div className={styles.marks}>
      {reversedMarks
        .map((mark) => (
          <Mark
            key={`${mark.date_visit}_${mark.lesson_number}_${mark.spec_name}`}
            date={mark.date_visit}
            number={mark.index}
            control_work_mark={mark.control_work_mark}
            home_work_mark={mark.home_work_mark}
            lab_work_mark={mark.lab_work_mark}
            class_work_mark={mark.class_work_mark}
            teacher_name={mark.teacher_name}
            spec_name={mark.spec_name}
            lesson_theme={mark.lesson_theme}
            status_was={mark.status_was}
          />
        ))
        .reverse()}
      {isAll && (
        <button
          className={styles.marks__button}
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Скрыть" : "Показать все"}
        </button>
      )}
      <UpButton />
    </div>
  );
}
