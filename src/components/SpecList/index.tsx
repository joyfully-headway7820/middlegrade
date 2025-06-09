import React, { useState, useEffect } from "react";
import { IDataElement, IExamsElement } from "../Stats";
import styles from "./SpecList.module.scss";
import activeSpecStore from "../../store/activeSpec.ts";
import { Check } from "lucide-react";
import { useCookies } from "react-cookie";
import { COOKIE_EXPIRY_DATE } from "../../constants/constants.ts";

interface IProps {
  initialMarks: IDataElement[];
  arrDate: string;
  setData: (data: IDataElement[]) => void;
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
  const skipSpecs = [
    "Иностранный язык",
    "Иностранный язык РПО",
    "Физическая культура",
    "Физическая культура РПО",
    "История",
    "История РПО",
  ];
  const [cookies, setCookies] = useCookies(["disableDone"]);
  const [considerPast, setConsiderPast] = useState<boolean>(false);
  const [settingDisableDone, setSettingDisableDone] = useState<boolean>(
    cookies.disableDone !== undefined ? cookies.disableDone : true,
  );
  const { activeSpec, setActiveSpec } = activeSpecStore();

  const examsNames: string[] = exams
    .filter((element) => element.mark != 0)
    .map((exam) => exam.spec.replace(" РПО", "").replace(" ГД", ""));

  const getSpecList = (): string[] => {
    let arr: string[] = initialMarks
      .filter((item, pos) =>
        considerPast ? true : new Date(item.date_visit) > new Date(arrDate),
      )
      .map((i) => i.spec_name.replace(" РПО", "").replace(" ГД", ""));

    arr = arr.filter((item, pos) => arr.indexOf(item) === pos).sort();

    if (settingDisableDone) {
      arr = arr.filter(
        (item) => !examsNames.includes(item) || skipSpecs.includes(item),
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
      setData(
        initialMarks.filter(
          (element) =>
            (element.spec_name === spec ||
              element.spec_name === `${spec} РПО` ||
              element.spec_name === `${spec} ГД`) &&
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
    setCookies("disableDone", newValue, {
      sameSite: "lax",
      secure: true,
      expires: COOKIE_EXPIRY_DATE,
    });
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
