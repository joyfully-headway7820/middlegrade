type WorkTypeBarProps = {
  label: string;
  value: number;
  share: number;
  color: string;
};

export const WorkTypeBar = ({ label, value, share, color }: WorkTypeBarProps) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between text-sm">
      <span className="text-ink-300">{label}</span>
      <span className="font-medium text-ink-100 tabular-nums">{value}</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-overlay">
      <div
        className="h-full rounded-full"
        style={{ width: `${share}%`, backgroundColor: color }}
      />
    </div>
  </div>
);
