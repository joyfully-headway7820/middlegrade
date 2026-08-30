import { useQuery } from "@tanstack/react-query";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { MonthView } from "@/components/schedule/MonthView";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, Segmented } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { useScheduleShareImage } from "@/hooks/useScheduleShareImage";
import {
  addDays,
  addMonths,
  formatDate,
  formatFullDate,
  formatMonth,
  startOfMonth,
  startOfWeek,
  toIsoDate,
} from "@/lib/format";
import { scheduleMonthQuery, scheduleRangeQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";
import { groupLessonsByDate } from "@/utils/groupLessonsByDate";
import { isEmptyError } from "@/utils/isEmptyError";
import { scheduleImageFileName } from "@/utils/scheduleImage";
import { saveScheduleImage } from "@/utils/saveScheduleImage";

type ScheduleView = "month" | "week" | "day";

const VIEW_OPTIONS = [
  { value: "month" as const, label: "Месяц" },
  { value: "week" as const, label: "Неделя" },
  { value: "day" as const, label: "День" },
];

const shiftLabel = (view: ScheduleView, direction: -1 | 1) => {
  if (view === "month") {
    return direction < 0 ? "Предыдущий месяц" : "Следующий месяц";
  }

  if (view === "week") {
    return direction < 0 ? "Предыдущая неделя" : "Следующая неделя";
  }

  return direction < 0 ? "Предыдущий день" : "Следующий день";
};

export const SchedulePage = () => {
  const [view, setView] = useState<ScheduleView>("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [saving, setSaving] = useState(false);
  const today = new Date();
  const groupName = useAuthStore((state) => state.user?.group_name);

  const monthAnchor = startOfMonth(cursor);
  const weekStart = startOfWeek(cursor);
  const weekEnd = addDays(weekStart, 6);
  const dayIso = toIsoDate(cursor);

  const monthResult = useQuery({
    ...scheduleMonthQuery(toIsoDate(monthAnchor)),
    enabled: view === "month",
  });

  const weekResult = useQuery({
    ...scheduleRangeQuery(toIsoDate(weekStart), toIsoDate(weekEnd)),
    enabled: view === "week" || view === "month",
  });

  const dayResult = useQuery({
    ...scheduleRangeQuery(dayIso, dayIso),
    enabled: view === "day",
  });

  const active =
    view === "month" ? monthResult : view === "week" ? weekResult : dayResult;

  const lessonsByDate = useMemo(
    () => groupLessonsByDate(active.data ?? []),
    [active.data],
  );

  const shift = (direction: -1 | 1) => {
    setCursor((prev) => {
      if (view === "month") {
        return addMonths(prev, direction);
      }

      return addDays(prev, view === "week" ? direction * 7 : direction);
    });
  };

  const weekLabel = `${formatDate(weekStart)} — ${formatDate(weekEnd)}`;
  const title =
    view === "month"
      ? formatMonth(monthAnchor)
      : view === "week"
        ? weekLabel
        : formatFullDate(cursor);

  const exportStart = view === "day" ? cursor : weekStart;
  const exportDays = view === "day" ? 1 : 7;
  const exportLessons = view === "day" ? dayResult.data : weekResult.data;
  const exportEnd = addDays(exportStart, exportDays - 1);
  const exportLabel = view === "day" ? formatFullDate(cursor) : weekLabel;
  const imageBlob = useScheduleShareImage(
    exportLessons?.length
      ? {
          start: exportStart,
          dayCount: exportDays,
          lessons: exportLessons,
          groupName,
          rangeLabel: exportLabel,
        }
      : null,
  );

  const saveImage = async () => {
    if (saving || !imageBlob) {
      return;
    }

    setSaving(true);

    try {
      await saveScheduleImage(
        imageBlob,
        scheduleImageFileName(toIsoDate(exportStart), toIsoDate(exportEnd)),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          Расписание
        </h1>
        <Segmented
          options={VIEW_OPTIONS}
          value={view}
          onChange={setView}
          ariaLabel="Вид расписания"
          className="w-auto max-w-full shrink-0 flex-nowrap [&_[role=tab]]:basis-0"
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
            onClick={() => void saveImage()}
            disabled={saving || !imageBlob}
            aria-label="Сохранить расписание"
            className="shrink-0 px-3 py-1.5"
          >
            <Camera className="size-4" aria-hidden />
          </Button>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label={shiftLabel(view, -1)}
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
              aria-label={shiftLabel(view, 1)}
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
          <EmptyState
            title={
              view === "day"
                ? "В этот день пар нет"
                : view === "week"
                  ? "На этой неделе пар нет"
                  : "В этом периоде занятий нет"
            }
          />
        ) : (
          <CardBody>
            {view === "month" ? (
              <MonthView
                anchor={monthAnchor}
                lessonsByDate={lessonsByDate}
                today={today}
                onSelectDay={(date) => {
                  setCursor(date);
                  setView("day");
                }}
              />
            ) : (
              <div className="-mx-5">
                <ScheduleTable
                  weekStart={view === "day" ? cursor : weekStart}
                  lessons={active.data ?? []}
                  today={today}
                  dayCount={view === "day" ? 1 : 7}
                />
              </div>
            )}
          </CardBody>
        )}
      </Card>
    </div>
  );
};
