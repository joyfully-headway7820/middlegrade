import { IZachetka } from "../../App";
import "./zachetka.scss";
import { toFive } from "../../utils/toFive";

export default function Exams({ data }: IZachetka) {
  return (
    <div className="zachetka">
      {data.map(
        (element) =>
          element.date && (
            <div className="zachetka__element">
              <div className="zachetka__name">{element.spec}</div>
              <div className="zachetka__grade">
                {element.date <= "2024-09-01"
                  ? toFive(element.mark)
                  : element.mark}
              </div>
              <div className="zachetka__date">{element.date}</div>
            </div>
          ),
      )}
    </div>
  );
}
