import { IData } from "../App";
import VisitCard from "./VisitCard.tsx";

export default function Visits({ data }: IData) {
  const studentWas: number[] = [];
  const studentLate: number[] = [];
  const studentWasnt: number[] = [];
  data.forEach((element, i) => {
    switch (element.status_was) {
      case 0:
        studentWasnt.push(i);
        break;
      case 1:
        studentWas.push(i);
        break;
      case 2:
        studentWas.push(i);
        studentLate.push(i);
        break;
      default:
    }
  });

  function countPercent(arr: number[]): number {
    if (arr.length) {
      return +(arr.length / (data.length / 100)).toFixed(2);
    }
    return 0;
  }

  return (
    <div className="cards">
      <VisitCard color="card--white" sum={data.length} text="Всего пар" />
      <VisitCard
        color="card--green"
        sum={studentWas.length}
        text="Посещено пар"
        percent={countPercent(studentWas)}
      />
      <VisitCard
        color="card--yellow"
        sum={studentLate.length}
        text="Опозданий"
        percent={countPercent(studentLate)}
      />
      <VisitCard
        color="card--red"
        sum={studentWasnt.length}
        text="Пропусков"
        percent={countPercent(studentWasnt)}
      />
    </div>
  );
}
