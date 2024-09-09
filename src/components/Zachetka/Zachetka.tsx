import { IZachetka } from "../../App";
import "../../css/zachetka.css";
import { toFive } from "../../utils/toFive";

export default function Zachetka({ data }: IZachetka) {
  return (
    <div className="zachetka">
      {data.map((element) => (
        <div className="zachetka__element">
          <div className="zachetka__name">{element.spec}</div>
          <div className="zachetka__grade">{toFive(element.mark)}</div>
        </div>
      ))}
    </div>
  );
}
