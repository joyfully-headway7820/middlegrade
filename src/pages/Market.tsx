import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Coins, Gem } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { Stat } from "@/components/ui/Stat";
import { GamingPointTypes } from "@/constants/constants";
import { ApiError, request } from "@/lib/api";
import { formatFullDate } from "@/lib/format";
import { marketQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";
import type { MarketProduct } from "@/types";

const pointsByType = (
  points: { new_gaming_point_types__id: number; points: number }[] | undefined,
  typeId: number,
) =>
  points?.find((entry) => entry.new_gaming_point_types__id === typeId)?.points ??
  0;

const Price = ({ coins, gems }: { coins: number; gems: number }) => (
  <span className="inline-flex items-center gap-3 text-sm tabular-nums text-ink-200">
    {coins > 0 ? (
      <span className="inline-flex items-center gap-1">
        {coins}
        <Coins className="size-3.5 text-amber-500" aria-label="Топкоины" />
      </span>
    ) : null}
    {gems > 0 ? (
      <span className="inline-flex items-center gap-1">
        {gems}
        <Gem className="size-3.5 text-emerald-500" aria-label="Гемы" />
      </span>
    ) : null}
    {coins === 0 && gems === 0 ? "Бесплатно" : null}
  </span>
);

const ProductCard = ({
  item,
  onBuy,
  pending,
  disabled,
}: {
  item: MarketProduct;
  onBuy: (id: number) => void;
  pending: boolean;
  disabled: boolean;
}) => (
  <li className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
    {item.photo ? (
      <img
        src={item.photo}
        alt=""
        className="aspect-4/3 w-full object-cover bg-overlay"
      />
    ) : (
      <div className="aspect-4/3 bg-overlay" />
    )}
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="min-w-0">
        <h3 className="text-sm font-medium break-words text-heading">{item.name}</h3>
        {item.description ? (
          <p className="mt-1 text-xs break-words text-ink-400">{item.description}</p>
        ) : null}
      </div>
      {item.stock !== null ? (
        <p className="text-xs text-ink-500">Доступно: {item.stock}</p>
      ) : null}
      <div className="mt-auto flex items-center justify-between gap-3">
        <Price coins={item.coins} gems={item.gems} />
        <Button
          type="button"
          disabled={disabled || pending || item.stock === 0}
          onClick={() => onBuy(item.id)}
        >
          {pending ? "Покупаем…" : "Купить"}
        </Button>
      </div>
    </div>
  </li>
);

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
