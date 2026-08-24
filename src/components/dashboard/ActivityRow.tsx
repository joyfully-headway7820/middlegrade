import { memo } from "react";
import { PointTypeIcon } from "@/components/ui/PointTypeIcon";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { activityLabel } from "@/utils/activityLabel";
import type { ActivityEntry } from "@/types";

type ActivityRowProps = {
  entry: ActivityEntry;
};

export const ActivityRow = memo(({ entry }: ActivityRowProps) => (
  <li className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0">
    <div className="min-w-0">
      <p className="truncate text-sm text-ink-100">{activityLabel(entry)}</p>
      <p className="text-xs text-ink-500">{formatDate(entry.date)}</p>
    </div>
    <span className="inline-flex shrink-0 items-center gap-1.5 tabular-nums">
      <span
        className={cn(
          "text-sm font-medium",
          entry.current_point >= 0 ? "text-good" : "text-bad",
        )}
      >
        {entry.current_point >= 0
          ? `+${entry.current_point}`
          : entry.current_point}
      </span>
      <PointTypeIcon typeId={entry.point_types_id} />
    </span>
  </li>
));

ActivityRow.displayName = "ActivityRow";
