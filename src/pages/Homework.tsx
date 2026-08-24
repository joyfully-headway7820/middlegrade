import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HomeworkCard } from "@/components/homework/HomeworkCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Segmented, Select } from "@/components/ui/Controls";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import {
  HOMEWORK_STATUS,
  HOMEWORK_STATUSES,
  HOMEWORK_TYPE,
  HOMEWORK_TYPES,
} from "@/constants/constants";
import { useHomeworkCounts } from "@/hooks/useHomeworkCounts";
import { homeworkGroupsQuery, homeworkQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";

export const HomeworkPage = () => {
  const user = useAuthStore((state) => state.user);
  const groups = useQuery(homeworkGroupsQuery());

  const [groupId, setGroupId] = useState<number | undefined>(user?.current_group_id);
  const [type, setType] = useState<number>(HOMEWORK_TYPE.HOMEWORK);
  const [status, setStatus] = useState<number>(HOMEWORK_STATUS.ACTIVE);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (groupId === undefined && user?.current_group_id) {
      setGroupId(user.current_group_id);
    }
  }, [groupId, user?.current_group_id]);

  const homework = useQuery(homeworkQuery(groupId, type, status, page));
  const counts = useHomeworkCounts(groupId);

  const changeType = (value: number) => {
    setType(value);
    setPage(1);
  };

  const changeStatus = (value: number) => {
    setStatus(value);
    setPage(1);
  };

  const changeGroup = (value: number) => {
    setGroupId(value);
    setPage(1);
  };

  const groupOptions =
    groups.data?.map((group) => ({ value: group.id, label: group.name })) ?? [];

  const typeOptions = HOMEWORK_TYPES.map((option) => ({
    ...option,
    badge: option.value === HOMEWORK_TYPE.LAB ? counts.labs : counts.homework,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">Задания</h1>
        <Segmented
          options={typeOptions}
          value={type}
          onChange={changeType}
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
                onChange={changeGroup}
                ariaLabel="Группа"
                className="w-56"
              />
            ) : null
          }
        />
        <CardBody>
          <Segmented
            options={HOMEWORK_STATUSES}
            value={status}
            onChange={changeStatus}
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
      ) : homework.isError ? (
        <ErrorState
          message="Не удалось загрузить задания"
          onRetry={() => void homework.refetch()}
        />
      ) : homework.data.items.length === 0 ? (
        <Card>
          <EmptyState
            title="Заданий нет"
            description="Попробуйте другой статус или тип задания"
          />
        </Card>
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {homework.data.items.map((item) => (
              <HomeworkCard key={item.id} item={item} />
            ))}
          </ul>
          <Pagination
            page={homework.data.page}
            pageCount={homework.data.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
};
