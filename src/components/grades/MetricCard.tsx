import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MetricTone =
  | "neutral"
  | "classwork"
  | "control"
  | "homework"
  | "lab"
  | "practical"
  | "present"
  | "late"
  | "absent";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  badge?: ReactNode;
  tone: MetricTone;
};

export const MetricCard = ({ label, value, badge, tone }: MetricCardProps) => (
  <div className={cn("metric-card", `metric-card--${tone}`)}>
    {badge !== undefined ? (
      <span className="metric-card__badge">{badge}</span>
    ) : null}
    <p
      className={cn(
        "text-3xl font-bold tracking-tight tabular-nums sm:text-4xl",
        badge !== undefined && "pr-12",
      )}
    >
      {value}
    </p>
    <p className="text-sm leading-snug text-ink-300">{label}</p>
  </div>
);
