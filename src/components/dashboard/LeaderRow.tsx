import { memo } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";

type LeaderRowProps = {
  position: number;
  name: string;
  photo: string;
  amount: number;
  isMe: boolean;
};

export const LeaderRow = memo(
  ({ position, name, photo, amount, isMe }: LeaderRowProps) => (
    <li
      className={cn(
        "flex items-center gap-3 border-b border-line px-5 py-2.5 last:border-0",
        isMe && "bg-brand-600/10",
      )}
    >
      <span className="w-6 text-right text-sm text-ink-500 tabular-nums">
        {position}
      </span>
      <Avatar name={name} src={photo} className="size-8" />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          isMe ? "font-medium text-heading" : "text-ink-200",
        )}
      >
        {name}
      </span>
      <span className="text-sm font-medium text-ink-300 tabular-nums">
        {amount}
      </span>
    </li>
  ),
);

LeaderRow.displayName = "LeaderRow";
