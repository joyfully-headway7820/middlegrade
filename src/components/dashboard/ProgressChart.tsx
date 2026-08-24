import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import { AreaChart } from "@/components/ui/AreaChart";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { formatShortMonth } from "@/lib/format";
import { chartQuery } from "@/lib/queries";
import { isEmptyError } from "@/utils/isEmptyError";

export type ProgressChartKind = "average-progress" | "attendance";

type ProgressChartProps = {
  kind: ProgressChartKind;
};

const META: Record<
  ProgressChartKind,
  { title: string; unit: string; ariaLabel: string; color: string; max?: number }
> = {
  "average-progress": {
    title: "Средний балл",
    unit: "балл",
    ariaLabel: "Средний балл по месяцам",
    color: "var(--color-brand-400)",
  },
  attendance: {
    title: "Посещаемость",
    unit: "%",
    ariaLabel: "Посещаемость по месяцам",
    color: "var(--color-mark-classwork)",
    max: 100,
  },
};

export const ProgressChart = memo(({ kind }: ProgressChartProps) => {
  const chart = useQuery(chartQuery(kind));
  const meta = META[kind];

  const data = useMemo(
    () =>
      (chart.data ?? []).map((point) => ({
        label: formatShortMonth(point.date),
        value:
          typeof point.points === "number" && Number.isFinite(point.points)
            ? point.points
            : null,
      })),
    [chart.data],
  );

  return (
    <Card>
      <CardHeader title={meta.title} description="динамика по месяцам" />
      <CardBody>
        {chart.isPending ? (
          <Skeleton className="h-56" />
        ) : isEmptyError(chart) ? (
          <ErrorState
            message="График недоступен"
            onRetry={() => void chart.refetch()}
          />
        ) : data.length === 0 ? (
          <EmptyState title="Данных пока нет" />
        ) : (
          <AreaChart
            data={data}
            color={meta.color}
            unit={meta.unit}
            max={meta.max}
            ariaLabel={meta.ariaLabel}
          />
        )}
      </CardBody>
    </Card>
  );
});

ProgressChart.displayName = "ProgressChart";
