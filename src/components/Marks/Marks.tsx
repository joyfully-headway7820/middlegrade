import { IDataElement } from "../../App.tsx";
import styles from "./Marks.module.scss";
import React from "react";
import Mark from "./Mark.tsx";
import UpButton from "../UpButton/UpButton.tsx";

interface Props {
  marks: IDataElement[];
}

export default function Marks({ marks }: Props) {
  const reversedMarks = React.useMemo(() => [...marks].reverse(), [marks]);

  return (
    <div className={styles.marks}>
      {reversedMarks
        .map((mark, index) => (
          <Mark
            key={`${mark.date_visit}_${mark.lesson_number}_${mark.spec_name}`}
            date={mark.date_visit}
            number={index}
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
      <UpButton />
    </div>
  );
}
