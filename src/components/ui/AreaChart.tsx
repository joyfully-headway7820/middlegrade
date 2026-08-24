import { memo, useId, useMemo, useState } from "react";
import { formatChartCaption } from "@/lib/format";
import { finiteSegments } from "@/utils/finiteSegments";

export type ChartDatum = {
  label: string;
  value: number | null;
};

type AreaChartProps = {
  data: ChartDatum[];
  color: string;
  unit?: string;
  max?: number;
  ariaLabel: string;
};

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 16, right: 12, bottom: 28, left: 36 };

const isGrade = (value: number | null): value is number =>
  typeof value === "number" && Number.isFinite(value);

const niceCeil = (value: number) => {
  if (value <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;

  return step * magnitude;
};

export const AreaChart = memo(
  ({ data, color, unit, max, ariaLabel }: AreaChartProps) => {
    const gradientId = useId();
    const [hovered, setHovered] = useState<number | null>(null);

    const plotWidth = WIDTH - PADDING.left - PADDING.right;
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const baseline = PADDING.top + plotHeight;

    const { points, ticks, upper, segments } = useMemo(() => {
      const finiteValues = data.map((item) => item.value).filter(isGrade);
      const rawMax = max ?? Math.max(...finiteValues, 0);
      const bound = niceCeil(rawMax);
      const step = data.length > 1 ? plotWidth / (data.length - 1) : 0;

      const coords = data.map((item, index) => ({
        ...item,
        x: PADDING.left + step * index,
        y: isGrade(item.value)
          ? PADDING.top + plotHeight - (item.value / bound) * plotHeight
          : baseline,
      }));

      return {
        points: coords,
        upper: bound,
        segments: finiteSegments(coords),
        ticks: [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
          value: Math.round(bound * ratio),
          y: PADDING.top + plotHeight - ratio * plotHeight,
        })),
      };
    }, [baseline, data, max, plotHeight, plotWidth]);

    if (points.length === 0) return null;

    const active = hovered !== null ? points[hovered] : null;

    return (
      <figure className="m-0">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={ariaLabel}
          className="h-56 w-full"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          {ticks.map((tick) => (
            <g key={tick.y}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={tick.y}
                y2={tick.y}
                stroke="var(--line)"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-ink-500 text-[11px]"
              >
                {tick.value}
              </text>
            </g>
          ))}

          {segments.map((segment) => {
            const first = segment[0];
            const last = segment[segment.length - 1];

            if (!first || !last) {
              return null;
            }

            const linePath = segment
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
              )
              .join(" ");

            return (
              <g key={`${first.x}-${last.x}`}>
                <path
                  d={`${linePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`}
                  fill={`url(#${gradientId})`}
                />
                <path
                  d={linePath}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {points.map((point, index) => (
            <g key={point.label + index}>
              <text
                x={point.x}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-ink-500 text-[11px]"
              >
                {point.label}
              </text>
              <rect
                x={point.x - 16}
                y={PADDING.top}
                width={32}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHovered(index)}
              />
            </g>
          ))}

          {active ? (
            <>
              <line
                x1={active.x}
                x2={active.x}
                y1={PADDING.top}
                y2={baseline}
                stroke="var(--heading)"
                strokeWidth={1}
              />
              {isGrade(active.value) ? (
                <circle cx={active.x} cy={active.y} r={4} fill={color} />
              ) : null}
            </>
          ) : null}
        </svg>

        <figcaption className="mt-1 h-5 text-center text-xs text-ink-400">
          {active
            ? formatChartCaption(active.label, active.value, unit)
            : `Максимум — ${upper}`}
        </figcaption>
      </figure>
    );
  },
);

AreaChart.displayName = "AreaChart";
