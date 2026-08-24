import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatSigned } from "@/lib/format";

type StatProps = {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  diff?: number | null;
  diffLabel?: string;
  accent?: string;
};

export const Stat = ({ label, value, hint, diff, diffLabel, accent }: StatProps) => {
  const hasDiff = typeof diff === "number" && diff !== 0;
  const positive = (diff ?? 0) > 0;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-2">
        {accent ? (
          <span
            aria-hidden
            className="size-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        ) : null}
        <p className="text-sm text-ink-400">{label}</p>
      </div>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-heading tabular-nums">
        {value}
      </p>

      <div className="mt-2 flex items-center gap-2 text-sm">
        {hasDiff ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              positive ? "text-good" : "text-bad",
            )}
          >
            {positive ? (
              <TrendingUp className="size-3.5" aria-hidden />
            ) : (
              <TrendingDown className="size-3.5" aria-hidden />
            )}
            {formatSigned(diff as number)}
            {diffLabel ? <span className="text-ink-500">{diffLabel}</span> : null}
          </span>
        ) : null}
        {hint ? <span className="text-ink-500">{hint}</span> : null}
      </div>
    </div>
  );
};
