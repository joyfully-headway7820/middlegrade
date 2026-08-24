type WorkTypeBarProps = {
  label: string;
  value: number;
  share: number;
  color: string;
};

export const WorkTypeBar = ({ label, value, share, color }: WorkTypeBarProps) => (
  <div className="min-w-0">
    <div className="mb-1.5 flex min-w-0 items-center justify-between gap-3 text-sm">
      <span className="min-w-0 truncate text-ink-300">{label}</span>
      <span className="shrink-0 font-medium text-ink-100 tabular-nums">
        {value}
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-overlay">
      <div
        className="h-full max-w-full rounded-full"
        style={{ width: `${Math.min(share, 100)}%`, backgroundColor: color }}
      />
    </div>
  </div>
);
