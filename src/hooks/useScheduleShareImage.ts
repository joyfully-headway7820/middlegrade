import { useEffect, useRef, useState } from "react";
import type { ScheduleLesson } from "@/types";
import {
  drawScheduleImage,
  readScheduleImageColors,
} from "@/utils/drawScheduleImage";

type ScheduleShareImageInput = {
  start: Date;
  dayCount: number;
  lessons: ScheduleLesson[];
  groupName?: string | null;
  rangeLabel: string;
};

export const useScheduleShareImage = (input: ScheduleShareImageInput | null) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const inputRef = useRef(input);
  inputRef.current = input;

  const startMs = input?.start.getTime() ?? 0;
  const dayCount = input?.dayCount ?? 0;
  const rangeLabel = input?.rangeLabel ?? "";
  const groupName = input?.groupName ?? "";
  const lessonKey =
    input?.lessons
      .map((item) => `${item.date}:${item.lesson}:${item.subject_name}`)
      .join("|") ?? "";

  useEffect(() => {
    const current = inputRef.current;
    if (!current || current.lessons.length === 0) {
      setBlob(null);
      return;
    }

    let cancelled = false;

    void drawScheduleImage({
      start: current.start,
      dayCount: current.dayCount,
      lessons: current.lessons,
      groupName: current.groupName,
      rangeLabel: current.rangeLabel,
      colors: readScheduleImageColors(),
    }).then(
      (next) => {
        if (!cancelled) {
          setBlob(next);
        }
      },
      () => {
        if (!cancelled) {
          setBlob(null);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [startMs, dayCount, rangeLabel, groupName, lessonKey]);

  return blob;
};
