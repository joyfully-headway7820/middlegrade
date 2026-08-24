import { LessonCard } from "./LessonCard";
import { Modal } from "@/components/ui/Modal";
import { WEEKDAYS_FULL } from "@/constants/constants";
import { formatFullDate } from "@/lib/format";
import { pluralRu } from "@/utils/pluralRu";
import type { ScheduleLesson } from "@/types";

type DayDialogProps = {
  date: Date;
  lessons: ScheduleLesson[];
  onClose: () => void;
};

export const DayDialog = ({ date, lessons, onClose }: DayDialogProps) => (
  <Modal
    title={formatFullDate(date)}
    description={`${WEEKDAYS_FULL[(date.getDay() + 6) % 7]} · ${lessons.length} ${pluralRu(
      lessons.length,
      ["пара", "пары", "пар"],
    )}`}
    onClose={onClose}
  >
    {lessons.length ? (
      <ul className="flex flex-col gap-2">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.lesson} lesson={lesson} />
        ))}
      </ul>
    ) : (
      <p className="py-6 text-center text-sm text-ink-500">В этот день пар нет</p>
    )}
  </Modal>
);
