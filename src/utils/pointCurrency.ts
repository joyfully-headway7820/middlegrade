import { GamingPointTypes } from "@/constants/constants";

export type PointCurrency = "coins" | "gems";

export const pointCurrency = (typeId: number): PointCurrency =>
  typeId === GamingPointTypes.Coins ? "gems" : "coins";
