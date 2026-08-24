import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LeaderRow } from "./LeaderRow";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { leadersQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";

const SCOPE_OPTIONS = [
  { value: "group" as const, label: "Группа" },
  { value: "stream" as const, label: "Поток" },
];

export const Leaderboard = () => {
  const [scope, setScope] = useState<"group" | "stream">("group");
  const leaders = useQuery(leadersQuery(scope));
  const user = useAuthStore((state) => state.user);

  const entries = useMemo(
    () =>
      (leaders.data?.entries ?? []).filter(
        (entry) =>
          entry != null &&
          typeof entry.id === "number" &&
          typeof entry.full_name === "string" &&
          entry.full_name.trim().length > 0,
      ),
    [leaders.data?.entries],
  );

  return (
    <Card>
      <CardHeader
        title="Рейтинг"
        description={
          leaders.data
            ? `Ваше место — ${leaders.data.summary.studentPosition}${
                leaders.data.summary.totalCount
                  ? ` из ${leaders.data.summary.totalCount}`
                  : ""
              }`
            : undefined
        }
        action={
          <Segmented
            options={SCOPE_OPTIONS}
            value={scope}
            onChange={setScope}
            ariaLabel="Область рейтинга"
          />
        }
      />
      {leaders.isPending ? (
        <CardBody>
          <Skeleton className="h-64" />
        </CardBody>
      ) : leaders.isError ? (
        <ErrorState
          message="Рейтинг недоступен"
          onRetry={() => void leaders.refetch()}
        />
      ) : entries.length === 0 ? (
        <EmptyState title="Рейтинг пуст" />
      ) : (
        <ul className="flex flex-col">
          {entries.map((entry) => (
            <LeaderRow
              key={entry.id}
              position={entry.position}
              name={entry.full_name}
              photo={entry.photo_path}
              amount={entry.amount}
              isMe={user ? entry.full_name === user.full_name : false}
            />
          ))}
        </ul>
      )}
    </Card>
  );
};
