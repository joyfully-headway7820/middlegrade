import React, { useEffect, useState } from "react";
import styles from "./SpecList.module.scss";
import activeSpecStore from "../../store/activeSpec.ts";
import { Check } from "lucide-react";
import { IMarkResponse, IExamsElement } from "../../@types";

interface IProps {
  initialMarks: IMarkResponse[];
  arrDate: string;
  setData: (data: IMarkResponse[]) => void;
  activeList: boolean;
  setActiveList: (activeList: boolean) => void;
  exams: IExamsElement[];
}

export default function SpecList({
  initialMarks,
  arrDate,
  setData,
  activeList,
  setActiveList,
  exams,
}: IProps) {
  const skipSpecs = ["Иностранный язык", "Физическая культура", "История"];

  const removeGroupPostfix = (name: string): string => {
    return name.replace(/\s+(РПО|ГД)(?:\s*\d+)?$/i, "").trim();
  };

  const shouldSkipSpec = (specName: string): boolean => {
    const cleanName = removeGroupPostfix(specName);
    return skipSpecs.some((skipSpec) => cleanName === skipSpec);
  };

  const disableDone = Boolean(localStorage.getItem("disableDone") || true);
  const [considerPast, setConsiderPast] = useState<boolean>(false);
  const [settingDisableDone, setSettingDisableDone] =
    useState<boolean>(disableDone);
  const { activeSpec, setActiveSpec } = activeSpecStore();

  const examsNames: string[] = exams
    .filter((element) => element.mark != 0)
    .map((exam) => removeGroupPostfix(exam.spec));

  const getSpecList = (): string[] => {
    let arr: string[] = initialMarks
      .filter((item, pos) =>
        considerPast ? true : new Date(item.date_visit) > new Date(arrDate),
      )
      .map((i) => removeGroupPostfix(i.spec_name));

    arr = arr.filter((item, pos) => arr.indexOf(item) === pos).sort();

    if (settingDisableDone) {
      arr = arr.filter(
        (item) => !examsNames.includes(item) || shouldSkipSpec(item),
      );
    }

    return arr;
  };

  const [specList, setSpecList] = useState<string[]>(getSpecList());

  useEffect(() => {
    setSpecList(getSpecList());
  }, [initialMarks, arrDate, considerPast, settingDisableDone, exams]);

  const switchData = (spec: string, considerPast: boolean) => {
    if (spec === "Все предметы") {
      setData(initialMarks);
    } else {
      const escapedSpec = spec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const specPattern = new RegExp(
        `^${escapedSpec}(\\s+(РПО|ГД)(\\s*\\d*)?)?$`,
        "i",
      );

      setData(
        initialMarks.filter(
          (element) =>
            specPattern.test(element.spec_name) &&
            (considerPast || new Date(element.date_visit) > new Date(arrDate)),
        ),
      );
    }
    setActiveSpec(spec);
    setActiveList(false);
  };

  const onClickDisableDone = () => {
    const newValue = !settingDisableDone;
    setSettingDisableDone(newValue);
    localStorage.setItem("disableDone", String(newValue));
  };

  return (
    <div className={styles.specList}>
      <div
        className={styles.specList__list}
        onClick={(event) => {
          event.stopPropagation();
          setActiveList(!activeList);
        }}
      >
        <div className={styles.specList__list__text}>{activeSpec}</div>
        {activeList && (
          <ul className={styles.specList__list__active}>
            <li
              className={styles.specList__list__active__item}
              onClick={() => {
                setData(initialMarks);
                setActiveSpec("Все предметы");
                setActiveList(false);
              }}
            >
              Все предметы
            </li>
            {specList.map((spec) => (
              <li
                className={styles.specList__list__active__item}
                key={spec}
                onClick={() => switchData(spec, considerPast)}
              >
                {spec}
              </li>
            ))}
          </ul>
        )}
      </div>

      {activeSpec !== "Все предметы" && (
        <button
          className={styles.specList__button}
          onClick={() => {
            setConsiderPast(!considerPast);
            switchData(activeSpec, !considerPast);
          }}
        >
          {considerPast ? "За всё время" : "За текущий курс"}
        </button>
      )}
      <button
        onClick={onClickDisableDone}
        title="Убирает из списка дисциплины, по которым уже прошёл зачёт или экзамен"
        className={styles.specList__filter}
      >
        <div className={styles.specList__filter__checkbox}>
          {settingDisableDone && (
            <div className={styles.specList__filter__checkbox__check}>
              <Check size={16} />
            </div>
          )}
        </div>
        <span className={styles.specList_filter__text}>Убрать завершённые</span>
      </button>
    </div>
  );
}
