import { ScheduleElement } from "../Schedule";
import React from "react";
import styled from "./ScheduleDay.module.scss";
import { Clock } from "lucide-react";

interface Props extends ScheduleElement {}

export const ScheduleDay = ({
  date,
  started_at,
  finished_at,
  subject_name,
  teacher_name,
  room_name,
}: Props) => {
  const thisDate = new Date();
  const day = thisDate.getDate();

  const isDateBlue = new Date(date).getDate() === day;
  console.log(new Date(date).getDate());
  console.log(day);

  return (
    <div
      key={date}
      className={`${styled.day} ${isDateBlue ? styled.blue : ""}`}
    >
      <div className={styled.day__time}>
        <Clock size={15} />
        {started_at} - {finished_at}
      </div>
      <div className={styled.day__subject}>{subject_name}</div>
      <div className={styled.day__teacher}>{teacher_name}</div>
      <div className={styled.day__room}>{room_name}</div>
    </div>
  );
};
