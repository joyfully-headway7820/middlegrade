import Card from "../Card";
import styles from "./Visits.module.scss";
import { distributeVisits } from "../../utils/distributeVisits.ts";
import { IMarkResponse } from "../../@types";

export default function Visits({ data }: { data: IMarkResponse[] }) {
  const {
    studentWas,
    studentLate,
    studentWasnt,
    wasPercent,
    latePercent,
    wasntPercent,
  } = distributeVisits(data);

  return (
    <div className={styles.visits}>
      <Card color="card--white" sum={data.length} text="Всего пар" />
      <Card
        color="card--green"
        sum={studentWas}
        text="Посещено пар"
        percent={wasPercent}
      />
      <Card
        color="card--yellow"
        sum={studentLate}
        text="Опозданий"
        percent={latePercent}
      />
      <Card
        color="card--red"
        sum={studentWasnt}
        text="Пропусков"
        percent={wasntPercent}
      />
    </div>
  );
}
