import { memo } from "react";
import { PointTypeIcon } from "@/components/ui/PointTypeIcon";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/format";
import { activityDelta } from "@/utils/activityDelta";
import { activityLabel } from "@/utils/activityLabel";
import type { ActivityEntry } from "@/types";

type ActivityRowProps = {
  entry: ActivityEntry;
};

export const ActivityRow = memo(({ entry }: ActivityRowProps) => {
  const delta = activityDelta(entry.action, entry.current_point);

  return (
    <li className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm text-ink-100">{activityLabel(entry)}</p>
        <p className="text-xs text-ink-500">{formatDateTime(entry.date)}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 tabular-nums">
        <span
          className={cn(
            "text-sm font-medium",
            delta >= 0 ? "text-good" : "text-bad",
          )}
        >
          {delta > 0 ? `+${delta}` : delta}
        </span>
        <PointTypeIcon typeId={entry.point_types_id} />
      </span>
    </li>
  );
});

ActivityRow.displayName = "ActivityRow";
