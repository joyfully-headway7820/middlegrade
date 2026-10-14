import type { ScheduleLesson } from "@/types";
import { isStudentWorkLesson } from "@/utils/isStudentWorkLesson";

const escapeIcsText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\n|\r/g, "\\n");

const foldIcsLine = (line: string) => {
  if (line.length <= 75) {
    return line;
  }

  const chunks: string[] = [];
  let rest = line;

  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = ` ${rest.slice(75)}`;
  }

  chunks.push(rest);
  return chunks.join("\r\n");
};

const toIcsLocalDateTime = (date: string, time: string) => {
  const digits = time.replace(/\D/g, "").padEnd(6, "0").slice(0, 6);
  return `${date.replace(/-/g, "")}T${digits}`;
};

const eventUid = (lesson: ScheduleLesson) =>
  `${lesson.date}-${lesson.lesson}-${lesson.started_at.replace(/\D/g, "")}@middlegrade`;

export const buildScheduleIcs = (lessons: ScheduleLesson[]) => {
  const events = lessons
    .filter((lesson) => !isStudentWorkLesson(lesson))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.lesson - b.lesson);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MiddleGrade//Schedule//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const lesson of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${eventUid(lesson)}`,
      `DTSTAMP:${toIcsLocalDateTime(lesson.date, lesson.started_at)}`,
      `DTSTART:${toIcsLocalDateTime(lesson.date, lesson.started_at)}`,
      `DTEND:${toIcsLocalDateTime(lesson.date, lesson.finished_at)}`,
      `SUMMARY:${escapeIcsText(lesson.subject_name)}`,
      `LOCATION:${escapeIcsText(lesson.room_name)}`,
      `DESCRIPTION:${escapeIcsText(lesson.teacher_name)}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
};

export const scheduleIcsFileName = (startIso: string, endIso: string) =>
  `raspisanie-${startIso}-${endIso}.ics`;
