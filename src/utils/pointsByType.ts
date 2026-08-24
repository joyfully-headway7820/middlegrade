import type { GamingPoints } from "@/types";

export const pointsByType = (
  points: GamingPoints[] | undefined,
  typeId: number,
) =>
  points?.find((entry) => entry.new_gaming_point_types__id === typeId)?.points ??
  0;
