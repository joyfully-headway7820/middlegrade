import { pointsByType } from "./pointsByType";
import { GamingPointTypes } from "@/constants/constants";
import type { GamingPoints } from "@/types";

export const studentBalances = (points: GamingPoints[] | undefined) => ({
  coins: pointsByType(points, GamingPointTypes.Gems),
  gems: pointsByType(points, GamingPointTypes.Coins),
});
