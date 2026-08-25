import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/market/ProductCard";
import { PurchaseRow } from "@/components/market/PurchaseRow";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { Stat } from "@/components/ui/Stat";
import { ApiError, request } from "@/lib/api";
import { marketQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";
import { isEmptyError } from "@/utils/isEmptyError";
import { studentBalances } from "@/utils/studentBalances";

export const MarketPage = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const catalog = useQuery(marketQuery());
  const [error, setError] = useState<string | null>(null);

  const { coins, gems } = studentBalances(user?.gaming_points);
  const { coins: spentCoins, gems: spentGems } = studentBalances(
    user?.spent_gaming_points,
  );

  const refreshWallet = async () => {
    setError(null);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["market"] }),
      queryClient.invalidateQueries({ queryKey: ["me"] }),
    ]);
  };

  const buy = useMutation({
    mutationFn: (productId: number) =>
      request<unknown>("/market/buy", { method: "POST", body: { productId } }),
    onSuccess: () => void refreshWallet(),
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
      <h1 className="text-2xl font-semibold tracking-tight text-heading">
        Маркет
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Топкоины" value={coins - spentCoins} />
        <Stat label="Гемы" value={gems - spentGems} />
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
      ) : isEmptyError(catalog) ? (
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
          <CardHeader
            title="Мои заказы"
            description={`${purchases.length} записей`}
          />
          <ul className="flex flex-col">
            {purchases.map((entry) => (
              <PurchaseRow
                key={`${entry.id}-${entry.date ?? ""}`}
                purchase={entry}
              />
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
};
