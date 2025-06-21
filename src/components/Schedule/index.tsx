import React from "react";
import "react-calendar/dist/Calendar.css";
import "./Schedule.module.scss";
import { monthScheduleQuery } from "../../queries/monthScheduleQuery.ts";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import styled from "./Schedule.module.scss";
import { ScheduleDay } from "../ScheduleDay";

export interface ScheduleElement {
  date: string;
  started_at: string;
  finished_at: string;
  lesson: number;
  room_name: string;
  subject_name: string;
  teacher_name: string;
}

const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getSunday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  return new Date(d.setDate(diff));
};

const sortArray = (array: ScheduleElement[]) => {
  array.sort((a, b) => {
    return new Date(a.started_at).getTime() - new Date(b.started_at).getTime();
  });
};

export const Schedule = () => {
  const mondaySchedule: ScheduleElement[] = [];
  const tuesdaySchedule: ScheduleElement[] = [];
  const wednesdaySchedule: ScheduleElement[] = [];
  const thursdaySchedule: ScheduleElement[] = [];
  const fridaySchedule: ScheduleElement[] = [];
  const saturdaySchedule: ScheduleElement[] = [];
  const sundaySchedule: ScheduleElement[] = [];

  const schedules: ScheduleElement[][] = [
    mondaySchedule,
    tuesdaySchedule,
    wednesdaySchedule,
    thursdaySchedule,
    fridaySchedule,
    saturdaySchedule,
    sundaySchedule,
  ];

  const days = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  const [cookies] = useCookies();

  const schedule = useQuery({
    queryKey: ["schedule"],
    queryFn: async () =>
      await monthScheduleQuery(
        cookies.access_token,
        getMonday(new Date()).toISOString().split("T")[0],
        getSunday(new Date()).toISOString().split("T")[0],
      ),
  });

  if (schedule.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (schedule.isError) {
    return <div>{schedule.error.message}</div>;
  }

  if (schedule.isSuccess) {
    schedule.data.forEach((element: ScheduleElement) => {
      switch (new Date(element.date).getDay()) {
        case 1:
          mondaySchedule.push(element);
          sortArray(mondaySchedule);
          break;
        case 2:
          tuesdaySchedule.push(element);
          sortArray(tuesdaySchedule);
          break;
        case 3:
          wednesdaySchedule.push(element);
          sortArray(wednesdaySchedule);
          break;
        case 4:
          thursdaySchedule.push(element);
          sortArray(thursdaySchedule);
          break;
        case 5:
          fridaySchedule.push(element);
          sortArray(fridaySchedule);
          break;
        case 6:
          saturdaySchedule.push(element);
          sortArray(saturdaySchedule);
          break;
        case 0:
          sundaySchedule.push(element);
          sortArray(sundaySchedule);
          break;
        default:
      }
    });
  }
  return (
    <div className={styled.schedule}>
      <div className={styled.schedule__week}>
        <div className={styled.schedule__week__header}>
          <button
            onClick={() => {
              getMonday(new Date()).setDate(
                getMonday(new Date()).getDate() - 7,
              );
              getSunday(new Date()).setDate(
                getSunday(new Date()).getDate() - 7,
              );
            }}
            className={styled.schedule__week__header__button}
          >
            {"<"}
          </button>
          <h2 className={styled.schedule__week__dates}>
            {getMonday(new Date()).toLocaleDateString()} -{" "}
            {getSunday(new Date()).toLocaleDateString()}
          </h2>
          <button
            onClick={() => {
              getMonday(new Date()).setDate(
                getMonday(new Date()).getDate() + 7,
              );
              getSunday(new Date()).setDate(
                getSunday(new Date()).getDate() + 7,
              );
            }}
            className={styled.schedule__week__header__button}
          >
            {">"}
          </button>
        </div>
        <p
          className={`${styled.schedule__week__dates} ${styled.schedule__week__schedule__temp}`}
        >
          Пока что в разработке, вариант не финальный
        </p>

        <div className={styled.schedule__week__schedule}>
          {schedules.map((schedule, index) => (
            <div className={styled.schedule__week__schedule__day} key={index}>
              <div className={styled.schedule__week__schedule__day__title}>
                <p>{days[index]}</p>
              </div>
              {schedule.map((element, index) => (
                <>
                  {index === 0 && (
                    <div
                      className={styled.schedule__week__schedule__day__title}
                    >
                      {element.date}
                    </div>
                  )}
                  <ScheduleDay
                    key={`${element.date} ${element.started_at}`}
                    {...element}
                  />
                </>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
