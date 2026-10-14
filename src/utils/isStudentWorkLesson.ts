import type { ScheduleLesson } from "@/types";

const STUDENT_WORK_ROOM =
  /(?<![\p{L}\p{N}_])(?:срс|cpc|srs)(?![\p{L}\p{N}_])/iu;

export const isStudentWorkLesson = (lesson: ScheduleLesson) =>
  STUDENT_WORK_ROOM.test(lesson.room_name);
