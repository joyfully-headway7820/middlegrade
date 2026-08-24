import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DayDialog } from "@/components/schedule/DayDialog";
import { MonthView } from "@/components/schedule/MonthView";
import { WeekView } from "@/components/schedule/WeekView";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Controls";
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
import { groupLessonsByDate } from "@/utils/groupLessonsByDate";

const VIEW_OPTIONS = [
  { value: "month" as const, label: "Месяц" },
  { value: "week" as const, label: "Неделя" },
];

export const SchedulePage = () => {
  const [view, setView] = useState<"month" | "week">("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const today = new Date();

  const monthAnchor = startOfMonth(cursor);
  const weekStart = startOfWeek(cursor);
  const weekEnd = addDays(weekStart, 6);

  const monthResult = useQuery({
    ...scheduleMonthQuery(toIsoDate(monthAnchor)),
    enabled: view === "month",
  });

  const weekResult = useQuery({
    ...scheduleRangeQuery(toIsoDate(weekStart), toIsoDate(weekEnd)),
    enabled: view === "week",
  });

  const active = view === "month" ? monthResult : weekResult;

  const lessonsByDate = useMemo(
    () => groupLessonsByDate(active.data ?? []),
    [active.data],
  );

  const shift = (direction: -1 | 1) => {
    setSelectedDay(null);
    setCursor((prev) =>
      view === "month" ? addMonths(prev, direction) : addDays(prev, direction * 7),
    );
  };

  const switchView = (next: "month" | "week") => {
    setSelectedDay(null);
    setView(next);
  };

  const title =
    view === "month"
      ? formatMonth(monthAnchor)
      : `${formatDate(weekStart)} — ${formatDate(weekEnd)}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">Расписание</h1>
        <Segmented
          options={VIEW_OPTIONS}
          value={view}
          onChange={switchView}
          ariaLabel="Вид расписания"
        />
      </div>

      <Card>
        <CardHeader
          title={<span className="normal-case">{title}</span>}
          action={
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label={view === "month" ? "Предыдущий месяц" : "Предыдущая неделя"}
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
                aria-label={view === "month" ? "Следующий месяц" : "Следующая неделя"}
                className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          }
        />

        {active.isPending ? (
          <CardBody>
            <Skeleton className="h-96" />
          </CardBody>
        ) : active.isError ? (
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
              <WeekView
                weekStart={weekStart}
                lessonsByDate={lessonsByDate}
                today={today}
              />
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
    </div>
  );
};
