import { Coins, Gem } from "lucide-react";
import { cn } from "@/lib/cn";
import { pointCurrency } from "@/utils/pointCurrency";

type PointTypeIconProps = {
  typeId: number;
  className?: string;
};

export const PointTypeIcon = ({ typeId, className }: PointTypeIconProps) => {
  if (pointCurrency(typeId) === "gems") {
    return (
      <Gem
        className={cn("size-3.5 text-emerald-400", className)}
        aria-label="Топгемы"
      />
    );
  }

  return (
    <Coins
      className={cn("size-3.5 text-amber-400", className)}
      aria-label="Топкоины"
    />
  );
};
