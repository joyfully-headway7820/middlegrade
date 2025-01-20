import React from "react";
import dataJson from "../data.json";
import { IDataElement } from "../App";

interface IProps {
  arrDate: string;
  setData: (data: IDataElement[]) => void;
  activeList: boolean;
  setActiveList: (activeList: boolean) => void;
}

export default function SpecList({
  arrDate,
  setData,
  activeList,
  setActiveList,
}: IProps) {
  const [activeSpec, setActiveSpec] = React.useState<string>("Все предметы");
  const [considerPast, setConsiderPast] = React.useState<boolean>(false);
  const arr: string[] = dataJson
    .filter((_, pos) => new Date(dataJson[pos].date_visit) > new Date(arrDate))
    .map((i) => i.spec_name);
  const specList: string[] = arr
    .filter((item: string, pos: number) => arr.indexOf(item) === pos)
    .sort();
  specList.forEach((element, pos) => {
    if (specList.includes(element) && specList.includes(`${element} РПО`)) {
      specList.splice(specList.indexOf(`${element} РПО`), 1);
    }
    if (element.includes(" РПО")) {
      specList[pos] = element.replace(" РПО", "");
    }
    if (element.includes(" ГД")) {
      specList[pos] = element.replace(" ГД", "");
    }
  });

  return (
    <div className="flex">
      <div
        className="active_spec"
        onClick={(event) => {
          event.stopPropagation();
          setActiveList(!activeList);
        }}
      >
        {activeSpec}
        {activeList && (
          <ul className="spec_list">
            <li
              className="spec_list__item"
              onClick={() => {
                setData(dataJson);
                setActiveSpec("Все предметы");
                setActiveList(false);
              }}
            >
              Все предметы
            </li>
            {specList.map((spec) => (
              <li
                className="spec_list__item"
                key={spec}
                onClick={() => {
                  if (considerPast) {
                    setData(
                      dataJson.filter(
                        (element) =>
                          element.spec_name === spec ||
                          element.spec_name === `${spec} РПО` ||
                          element.spec_name === `${spec} ГД`,
                      ),
                    );
                  } else {
                    setData(
                      dataJson.filter(
                        (element) =>
                          (element.spec_name === spec ||
                            element.spec_name === `${spec} РПО` ||
                            element.spec_name === `${spec} ГД`) &&
                          new Date(element.date_visit) > new Date(arrDate),
                      ),
                    );
                  }

                  setActiveSpec(spec);
                  setActiveList(false);
                }}
              >
                {spec}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="toggle_consider"
        onClick={() => setConsiderPast(!considerPast)}
      >
        {considerPast ? "За всё время" : "За текущий курс"}
      </button>
    </div>
  );
}
