import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.scss";

type CalendarValuePiece = Date | null;

type CalendarValue =
  | CalendarValuePiece
  | [CalendarValuePiece, CalendarValuePiece];

export const Schedule = () => {
  const [calendarValue, setCalendarValue] = React.useState<CalendarValue>(
    new Date(),
  );

  const onClickCalendarTile = () => {
    const calendarValueDate = calendarValue;

    console.log(calendarValueDate);
  };
  return (
    <div>
      <Calendar
        onChange={setCalendarValue}
        value={calendarValue}
        locale="RU"
        onClickDay={onClickCalendarTile}
      ></Calendar>
    </div>
  );
};
