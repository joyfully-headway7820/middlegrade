import { useQuery } from "@tanstack/react-query";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DayDialog } from "@/components/schedule/DayDialog";
import { MonthView } from "@/components/schedule/MonthView";
import { SchedulePreview } from "@/components/schedule/SchedulePreview";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, Segmented } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import {
  addDays,
  addMonths,
  formatDate,
  formatMonth,
  startOfMonth,
  startOfWeek,
  toIsoDate,
} from "@/lib/format";
import { scheduleMonthQuery, scheduleRangeQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";
import { groupLessonsByDate } from "@/utils/groupLessonsByDate";
import { isEmptyError } from "@/utils/isEmptyError";

const VIEW_OPTIONS = [
  { value: "month" as const, label: "Месяц" },
  { value: "week" as const, label: "Неделя" },
];

export const SchedulePage = () => {
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const today = new Date();
  const groupName = useAuthStore((state) => state.user?.group_name);

  const monthAnchor = startOfMonth(cursor);
  const weekStart = startOfWeek(cursor);
  const weekEnd = addDays(weekStart, 6);

  const monthResult = useQuery({
    ...scheduleMonthQuery(toIsoDate(monthAnchor)),
    enabled: view === "month",
  });

  const weekResult = useQuery({
    ...scheduleRangeQuery(toIsoDate(weekStart), toIsoDate(weekEnd)),
    enabled: view === "week" || previewOpen,
  });

  const active = view === "month" ? monthResult : weekResult;

  const lessonsByDate = useMemo(
    () => groupLessonsByDate(active.data ?? []),
    [active.data],
  );

  const shift = (direction: -1 | 1) => {
    setSelectedDay(null);
    setCursor((prev) =>
      view === "month"
        ? addMonths(prev, direction)
        : addDays(prev, direction * 7),
    );
  };

  const switchView = (next: "month" | "week") => {
    setSelectedDay(null);
    setView(next);
  };

  const weekLabel = `${formatDate(weekStart)} — ${formatDate(weekEnd)}`;
  const title = view === "month" ? formatMonth(monthAnchor) : weekLabel;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Расписание
        </h1>
        <Segmented
          options={VIEW_OPTIONS}
          value={view}
          onChange={switchView}
          ariaLabel="Вид расписания"
          className="w-auto shrink-0 flex-nowrap"
        />
      </div>

      <Card>
        <header className="flex items-center gap-3 overflow-x-auto border-b border-line px-5 py-3">
          <h2 className="shrink-0 text-sm font-semibold tracking-wide text-ink-100 normal-case">
            {title}
          </h2>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
            aria-label="Превью"
            className="shrink-0 px-3 py-1.5"
          >
            <Camera className="size-4" aria-hidden />
          </Button>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label={
                view === "month" ? "Предыдущий месяц" : "Предыдущая неделя"
              }
              className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setCursor(new Date())}
              className="rounded-lg px-3 py-1.5 text-sm text-ink-300 transition-colors hover:bg-overlay hover:text-heading"
            >
              Сегодня
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label={
                view === "month" ? "Следующий месяц" : "Следующая неделя"
              }
              className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </header>

        {active.isPending ? (
          <CardBody>
            <Skeleton className="h-96" />
          </CardBody>
        ) : isEmptyError(active) ? (
          <ErrorState
            message="Не удалось загрузить расписание"
            onRetry={() => void active.refetch()}
          />
        ) : (active.data?.length ?? 0) === 0 ? (
          <EmptyState title="В этом периоде занятий нет" />
        ) : (
          <CardBody>
            {view === "month" ? (
              <MonthView
                anchor={monthAnchor}
                lessonsByDate={lessonsByDate}
                today={today}
                onSelectDay={setSelectedDay}
              />
            ) : (
              <div className="-mx-5">
                <ScheduleTable
                  weekStart={weekStart}
                  lessons={active.data ?? []}
                  today={today}
                />
              </div>
            )}
          </CardBody>
        )}
      </Card>

      {selectedDay ? (
        <DayDialog
          date={selectedDay}
          lessons={lessonsByDate.get(toIsoDate(selectedDay)) ?? []}
          onClose={() => setSelectedDay(null)}
        />
      ) : null}

      {previewOpen ? (
        <SchedulePreview
          groupName={groupName}
          rangeLabel={weekLabel}
          weekStart={weekStart}
          lessons={weekResult.data ?? []}
          today={today}
          pending={weekResult.isPending}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </div>
  );
};
