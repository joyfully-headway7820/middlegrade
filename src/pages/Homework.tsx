import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HomeworkFeed } from "@/components/homework/HomeworkFeed";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Segmented, Select } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import {
  HOMEWORK_STATUS,
  HOMEWORK_STATUSES,
  HOMEWORK_TYPE,
  HOMEWORK_TYPES,
} from "@/constants/constants";
import { useHomeworkCounts } from "@/hooks/useHomeworkCounts";
import { homeworkFeedQuery, homeworkGroupsQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";
import { flattenHomeworkPages } from "@/utils/flattenHomeworkPages";
import { isEmptyError } from "@/utils/isEmptyError";

export const HomeworkPage = () => {
  const user = useAuthStore((state) => state.user);
  const groups = useQuery(homeworkGroupsQuery());

  const [groupId, setGroupId] = useState<number | undefined>(user?.current_group_id);
  const [type, setType] = useState<number>(HOMEWORK_TYPE.HOMEWORK);
  const [status, setStatus] = useState<number>(HOMEWORK_STATUS.ACTIVE);

  useEffect(() => {
    if (groupId === undefined && user?.current_group_id) {
      setGroupId(user.current_group_id);
    }
  }, [groupId, user?.current_group_id]);

  const homework = useInfiniteQuery(homeworkFeedQuery(groupId, type, status));
  const counts = useHomeworkCounts(groupId);
  const items = useMemo(
    () => flattenHomeworkPages(homework.data?.pages ?? []),
    [homework.data?.pages],
  );
  const loadMore = useCallback(() => {
    void homework.fetchNextPage();
  }, [homework.fetchNextPage]);

  const groupOptions =
    groups.data?.map((group) => ({ value: group.id, label: group.name })) ?? [];

  const typeOptions = HOMEWORK_TYPES.map((option) => ({
    ...option,
    badge: option.value === HOMEWORK_TYPE.LAB ? counts.labs : counts.homework,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">Задания</h1>
        <Segmented
          options={typeOptions}
          value={type}
          onChange={setType}
          ariaLabel="Тип задания"
        />
      </div>

      <Card>
        <CardHeader
          title="Фильтры"
          action={
            groupOptions.length > 1 && groupId !== undefined ? (
              <Select
                options={groupOptions}
                value={groupId}
                onChange={setGroupId}
                ariaLabel="Группа"
                className="w-full min-w-0 sm:w-56"
              />
            ) : null
          }
        />
        <CardBody>
          <Segmented
            options={HOMEWORK_STATUSES}
            value={status}
            onChange={setStatus}
            ariaLabel="Статус задания"
          />
        </CardBody>
      </Card>

      {homework.isPending ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : isEmptyError(homework) ? (
        <ErrorState
          message="Не удалось загрузить задания"
          onRetry={() => void homework.refetch()}
        />
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            title="Заданий нет"
            description="Попробуйте другой статус или тип задания"
          />
        </Card>
      ) : (
        <HomeworkFeed
          items={items}
          hasMore={Boolean(homework.hasNextPage)}
          isLoadingMore={homework.isFetchingNextPage}
          loadError={homework.isFetchNextPageError}
          onLoadMore={loadMore}
          onRetry={loadMore}
        />
      )}
    </div>
  );
};
