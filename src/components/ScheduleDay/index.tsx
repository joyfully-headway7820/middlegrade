import { ScheduleElement } from "../Schedule";
import React from "react";
import styled from "./ScheduleDay.module.scss";

interface Props extends ScheduleElement {}

export const ScheduleDay = ({
  date,
  started_at,
  finished_at,
  subject_name,
  teacher_name,
  room_name,
}: Props) => {
  return (
    <div key={date} className={styled.day}>
      <div className={styled.day__time}>
        {started_at} - {finished_at}
      </div>
      <div className={styled.day__subject}>{subject_name}</div>
      <div className={styled.day__teacher}>{teacher_name}</div>
      <div className={styled.day__room}>{room_name}</div>
    </div>
  );
};
