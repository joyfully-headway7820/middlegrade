import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { WorkTypeBar } from "./WorkTypeBar";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { MARK_KINDS } from "@/constants/constants";
import { performanceQuery } from "@/lib/queries";

export const WorkTypeBars = () => {
  const performance = useQuery(performanceQuery());

  const bars = useMemo(() => {
    const progress = performance.data?.progress;
    if (!progress) return [];

    const entries = [
      { key: "classwork", value: progress.classwork },
      { key: "homework", value: progress.homework },
      { key: "laboratory", value: progress.laboratory },
      { key: "control", value: progress.control },
      { key: "practical", value: progress.coursework },
      { key: "exams", value: progress.exams },
    ] as const;

    const max = Math.max(...entries.map((entry) => entry.value), 1);

    return entries.map((entry) => {
      const meta = MARK_KINDS.find((kind) => kind.key === entry.key);

      return {
        key: entry.key,
        label: meta?.label ?? entry.key,
        color: meta?.color ?? "var(--color-brand-400)",
        value: entry.value,
        share: (entry.value / max) * 100,
      };
    });
  }, [performance.data]);

  return (
    <Card>
      <CardHeader title="Баллы по типам работ" />
      {performance.isPending ? (
        <CardBody>
          <Skeleton className="h-56" />
        </CardBody>
      ) : performance.isError ? (
        <ErrorState
          message="Не удалось загрузить статистику"
          onRetry={() => void performance.refetch()}
        />
      ) : (
        <CardBody className="flex flex-col gap-3.5">
          {bars.map((bar) => (
            <WorkTypeBar
              key={bar.key}
              label={bar.label}
              value={bar.value}
              share={bar.share}
              color={bar.color}
            />
          ))}
        </CardBody>
      )}
    </Card>
  );
};
