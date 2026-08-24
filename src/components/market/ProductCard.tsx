import { Coins, Gem } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Controls";
import { Modal } from "@/components/ui/Modal";
import type { MarketProduct } from "@/types";

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

type ProductCardProps = {
  item: MarketProduct;
  onBuy: (id: number) => void;
  pending: boolean;
  disabled: boolean;
};

export const ProductCard = ({
  item,
  onBuy,
  pending,
  disabled,
}: ProductCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      {item.photo ? (
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          aria-label={`Открыть фото: ${item.name}`}
          className="aspect-4/3 w-full cursor-pointer overflow-hidden border-0 bg-overlay p-0 transition-opacity hover:opacity-90"
        >
          <img src={item.photo} alt="" className="size-full object-cover" />
        </button>
      ) : (
        <div className="aspect-4/3 bg-overlay" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <h3 className="text-sm font-medium break-words text-heading">
            {item.name}
          </h3>
          {item.description ? (
            <p className="mt-1 text-xs break-words text-ink-400">
              {item.description}
            </p>
          ) : null}
        </div>
        {item.stock !== null ? (
          <p className="text-xs text-ink-500">Доступно: {item.stock}</p>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
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
      {previewOpen && item.photo ? (
        <Modal title={item.name} onClose={() => setPreviewOpen(false)}>
          <img
            src={item.photo}
            alt={item.name}
            className="mx-auto max-h-[70vh] w-full object-contain"
          />
        </Modal>
      ) : null}
    </li>
  );
};
