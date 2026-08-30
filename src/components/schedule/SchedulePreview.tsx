import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { SchedulePreviewCard } from "./SchedulePreviewCard";
import { Spinner } from "@/components/ui/States";
import type { ScheduleLesson } from "@/types";

type SchedulePreviewProps = {
  groupName: string | null | undefined;
  rangeLabel: string;
  weekStart: Date;
  lessons: ScheduleLesson[];
  today: Date;
  pending: boolean;
  onClose: () => void;
};

export const SchedulePreview = ({
  groupName,
  rangeLabel,
  weekStart,
  lessons,
  today,
  pending,
  onClose,
}: SchedulePreviewProps) => {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const closeHandler = useRef(onClose);

  closeHandler.current = onClose;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeHandler.current();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-canvas/92 p-3 backdrop-blur-md sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="mx-auto flex min-h-0 w-full max-w-[96rem] flex-1 flex-col"
      >
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 id={titleId} className="text-sm font-medium text-ink-200">
              Превью расписания
            </h2>
            <p className="text-xs text-ink-500">Скриншот таблицы ниже — и в чат</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="scrollbar-slim min-h-0 flex-1 overflow-auto">
          {pending ? (
            <Spinner label="Собираем неделю" />
          ) : (
            <SchedulePreviewCard
              groupName={groupName}
              rangeLabel={rangeLabel}
              weekStart={weekStart}
              lessons={lessons}
              today={today}
            />
          )}
        </div>
      </div>
    </div>
  );
};
