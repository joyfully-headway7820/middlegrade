import { useQuery } from "@tanstack/react-query";
import { ActivityRow } from "./ActivityRow";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { activityQuery } from "@/lib/queries";
import { isEmptyError } from "@/utils/isEmptyError";

export const RecentActivity = () => {
  const activity = useQuery(activityQuery(30));
  const entries = activity.data ?? [];

  return (
    <Card className="flex max-h-[min(36rem,70vh)] min-h-0 flex-col overflow-hidden lg:h-0 lg:max-h-none lg:min-h-full">
      <CardHeader title="Последние начисления" />
      {activity.isPending ? (
        <CardBody className="min-h-0 flex-1">
          <Skeleton className="h-full min-h-56" />
        </CardBody>
      ) : isEmptyError(activity) ? (
        <ErrorState
          message="Не удалось загрузить активность"
          onRetry={() => void activity.refetch()}
        />
      ) : entries.length === 0 ? (
        <EmptyState title="Начислений пока нет" />
      ) : (
        <ul className="scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {entries.map((entry, index) => (
            <ActivityRow key={`${entry.date}-${index}`} entry={entry} />
          ))}
        </ul>
      )}
    </Card>
  );
};
