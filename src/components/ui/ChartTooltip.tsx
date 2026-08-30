type ChartTooltipProps = {
  x: number;
  y: number;
  text: string;
};

export const ChartTooltip = ({ x, y, text }: ChartTooltipProps) => (
  <div
    role="tooltip"
    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1 text-sm text-ink-100 shadow-lg shadow-black/40"
    style={{ left: x, top: y }}
  >
    {text}
  </div>
);
