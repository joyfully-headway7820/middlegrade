import { Badge } from "@/components/ui/Controls";
import { formatFullDate } from "@/lib/format";
import type { MarketPurchase } from "@/types";
import { orderStatusLabel, orderStatusTone } from "@/utils/orderStatusLabel";

const itemLabel = (name: string, count: number): string =>
  count > 1 ? `${name} ×${count}` : name;

type PurchaseRowProps = {
  purchase: MarketPurchase;
};

export const PurchaseRow = ({ purchase }: PurchaseRowProps) => (
  <li className="flex flex-col gap-2 border-b border-line px-5 py-3 last:border-0">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm break-words text-ink-100">{purchase.name}</p>
        <p className="text-xs text-ink-500">
          №{purchase.id}
          {purchase.date ? ` · ${formatFullDate(purchase.date)}` : ""}
        </p>
      </div>
      <Badge tone={orderStatusTone(purchase.status)}>
        {orderStatusLabel(purchase.status)}
      </Badge>
    </div>
    {purchase.items.length > 1 ? (
      <ul className="flex flex-col gap-1">
        {purchase.items.map((item) => (
          <li key={`${purchase.id}-${item.id}`} className="text-xs text-ink-400">
            {itemLabel(item.name, item.count)}
          </li>
        ))}
      </ul>
    ) : null}
  </li>
);
