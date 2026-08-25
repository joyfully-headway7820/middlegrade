import { useState } from "react";
import { Badge, Button } from "@/components/ui/Controls";
import { Modal } from "@/components/ui/Modal";
import { formatFullDate } from "@/lib/format";
import type { MarketPurchase } from "@/types";
import { orderStatusLabel, orderStatusTone } from "@/utils/orderStatusLabel";

const itemLabel = (name: string, count: number): string =>
  count > 1 ? `${name} ×${count}` : name;

type PurchaseRowProps = {
  purchase: MarketPurchase;
  onCancel: (id: number) => void;
  pending: boolean;
  disabled: boolean;
};

export const PurchaseRow = ({
  purchase,
  onCancel,
  pending,
  disabled,
}: PurchaseRowProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <li className="flex flex-col gap-2 border-b border-line px-5 py-3 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm break-words text-ink-100">{purchase.name}</p>
          <p className="text-xs text-ink-500">
            №{purchase.id}
            {purchase.date ? ` · ${formatFullDate(purchase.date)}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Badge tone={orderStatusTone(purchase.status)}>
            {orderStatusLabel(purchase.status)}
          </Badge>
          {purchase.cancellable ? (
            <Button
              type="button"
              variant="outline"
              disabled={disabled || pending}
              onClick={() => setConfirmOpen(true)}
            >
              {pending ? "Отменяем…" : "Отменить"}
            </Button>
          ) : null}
        </div>
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
      {confirmOpen ? (
        <Modal
          title="Отменить заказ"
          description={purchase.name}
          onClose={() => setConfirmOpen(false)}
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-200">
              Отменить заказ №{purchase.id}?
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                Назад
              </Button>
              <Button
                type="button"
                disabled={pending}
                onClick={() => {
                  setConfirmOpen(false);
                  onCancel(purchase.id);
                }}
              >
                Отменить заказ
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </li>
  );
};
