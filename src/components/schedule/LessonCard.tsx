import { Clock, MapPin, User } from "lucide-react";
import { formatTime } from "@/lib/format";
import type { ScheduleLesson } from "@/types";

export const LessonCard = ({ lesson }: { lesson: ScheduleLesson }) => (
  <li className="flex gap-3 rounded-xl border border-line bg-surface p-3">
    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600/20 text-xs font-semibold text-brand-200 tabular-nums">
      {lesson.lesson}
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium break-words text-ink-50">
        {lesson.subject_name}
      </p>

      <div className="mt-1.5 flex flex-col gap-1 text-xs text-ink-400">
        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          {formatTime(lesson.started_at)}–{formatTime(lesson.finished_at)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {lesson.room_name}
        </span>
        <span className="inline-flex items-start gap-1.5 break-words">
          <User className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {lesson.teacher_name}
        </span>
      </div>
    </div>
  </li>
);
