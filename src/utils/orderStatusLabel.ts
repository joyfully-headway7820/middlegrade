import type { MarketOrderStatus } from "@/types";

const LABELS: Record<MarketOrderStatus, string> = {
  new: "Новый",
  rejected: "Отменён",
  closed: "Выдан",
  unknown: "Неизвестно",
};

const TONES: Record<MarketOrderStatus, "brand" | "bad" | "good" | "neutral"> = {
  new: "brand",
  rejected: "bad",
  closed: "good",
  unknown: "neutral",
};

export const orderStatusLabel = (status: MarketOrderStatus): string =>
  LABELS[status];

export const orderStatusTone = (
  status: MarketOrderStatus,
): "brand" | "bad" | "good" | "neutral" => TONES[status];
