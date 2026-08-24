import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/market/ProductCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { Stat } from "@/components/ui/Stat";
import { GamingPointTypes } from "@/constants/constants";
import { ApiError, request } from "@/lib/api";
import { formatFullDate } from "@/lib/format";
import { marketQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";

const pointsByType = (
  points: { new_gaming_point_types__id: number; points: number }[] | undefined,
  typeId: number,
) =>
  points?.find((entry) => entry.new_gaming_point_types__id === typeId)?.points ??
  0;

export const MarketPage = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const catalog = useQuery(marketQuery());
  const [error, setError] = useState<string | null>(null);

  const coins = pointsByType(user?.gaming_points, GamingPointTypes.Gems);
  const gems = pointsByType(user?.gaming_points, GamingPointTypes.Coins);
  const spentCoins = pointsByType(user?.spent_gaming_points, GamingPointTypes.Gems);
  const spentGems = pointsByType(user?.spent_gaming_points, GamingPointTypes.Coins);

  const buy = useMutation({
    mutationFn: (productId: number) =>
      request<unknown>("/market/buy", { method: "POST", body: { productId } }),
    onSuccess: async () => {
      setError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["market"] }),
        queryClient.invalidateQueries({ queryKey: ["me"] }),
      ]);
    },
    onError: (cause: unknown) => {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Не удалось выполнить покупку",
      );
    },
  });

  const purchases = catalog.data?.purchases ?? [];

  const buyingId = buy.isPending ? buy.variables : null;

  const sorted = useMemo(
    () =>
      [...(catalog.data?.items ?? [])].sort((a, b) =>
        a.name.localeCompare(b.name, "ru"),
      ),
    [catalog.data?.items],
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-heading">Маркет</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Топкоины"
          value={coins}
          hint={spentCoins ? `потрачено ${spentCoins}` : "доступно"}
        />
        <Stat
          label="Гемы"
          value={gems}
          hint={spentGems ? `потрачено ${spentGems}` : "доступно"}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-bad">
          {error}
        </p>
      ) : null}

      {catalog.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      ) : catalog.isError ? (
        <ErrorState
          message="Не удалось загрузить каталог"
          onRetry={() => void catalog.refetch()}
        />
      ) : sorted.length === 0 ? (
        <Card>
          <EmptyState title="Каталог пуст" />
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              pending={buyingId === item.id}
              disabled={buy.isPending}
              onBuy={(id) => buy.mutate(id)}
            />
          ))}
        </ul>
      )}

      {purchases.length ? (
        <Card>
          <CardHeader title="Мои покупки" description={`${purchases.length} записей`} />
          <ul className="flex flex-col">
            {purchases.map((entry) => (
              <li
                key={`${entry.id}-${entry.date ?? ""}`}
                className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0"
              >
                <p className="text-sm break-words text-ink-100">{entry.name}</p>
                <p className="shrink-0 text-xs text-ink-500">
                  {entry.date ? formatFullDate(entry.date) : "—"}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
};
