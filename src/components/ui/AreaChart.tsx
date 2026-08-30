import { memo, useId, useMemo, useState, type MouseEvent } from "react";
import { ChartTooltip } from "@/components/ui/ChartTooltip";
import { formatChartCaption } from "@/lib/format";
import { finiteSegments } from "@/utils/finiteSegments";
import { isFiniteChartValue } from "@/utils/isFiniteChartValue";
import { lastChartDatum } from "@/utils/lastChartDatum";
import { trimChartSeries } from "@/utils/trimChartSeries";
import { visibleLabelIndexes } from "@/utils/visibleLabelIndexes";

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

type ChartCursor = {
  x: number;
  y: number;
};

const WIDTH = 640;
const HEIGHT = 228;
const PADDING = { top: 16, right: 36, bottom: 36, left: 44 };

const niceCeil = (value: number) => {
  if (value <= 0) return 1;

  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;

  return step * magnitude;
};

const cursorFromEvent = (
  event: MouseEvent<Element>,
  svg: SVGSVGElement,
): ChartCursor => {
  const rect = svg.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

export const AreaChart = memo(
  ({ data, color, unit, max, ariaLabel }: AreaChartProps) => {
    const gradientId = useId();
    const [hovered, setHovered] = useState<number | null>(null);
    const [cursor, setCursor] = useState<ChartCursor | null>(null);

    const plotWidth = WIDTH - PADDING.left - PADDING.right;
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const baseline = PADDING.top + plotHeight;

    const series = useMemo(() => trimChartSeries(data), [data]);

    const labelIndexes = useMemo(
      () => visibleLabelIndexes(series.length),
      [series.length],
    );

    const last = useMemo(() => lastChartDatum(series), [series]);

    const { points, ticks, segments, step } = useMemo(() => {
      const finiteValues = series.map((item) => item.value).filter(isFiniteChartValue);
      const rawMax = max ?? Math.max(...finiteValues, 0);
      const bound = niceCeil(rawMax);
      const gap = series.length > 1 ? plotWidth / (series.length - 1) : 0;

      const coords = series.map((item, index) => ({
        ...item,
        x: PADDING.left + gap * index,
        y: isFiniteChartValue(item.value)
          ? PADDING.top + plotHeight - (item.value / bound) * plotHeight
          : baseline,
      }));

      return {
        points: coords,
        segments: finiteSegments(coords),
        step: gap,
        ticks: [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
          value: Math.round(bound * ratio),
          y: PADDING.top + plotHeight - ratio * plotHeight,
        })),
      };
    }, [baseline, max, plotHeight, plotWidth, series]);

    if (points.length === 0) return null;

    const active = hovered !== null ? points[hovered] : null;
    const hitWidth = step > 0 ? step : 32;

    const setCursorFromSvg = (event: MouseEvent<Element>) => {
      const svg =
        event.currentTarget instanceof SVGSVGElement
          ? event.currentTarget
          : event.currentTarget.closest("svg");

      if (svg instanceof SVGSVGElement) {
        setCursor(cursorFromEvent(event, svg));
      }
    };

    return (
      <figure className="relative m-0 min-w-0">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={ariaLabel}
          className="h-56 w-full max-w-full"
          overflow="visible"
          onMouseMove={setCursorFromSvg}
          onMouseLeave={() => {
            setHovered(null);
            setCursor(null);
          }}
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
                x={PADDING.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-ink-500 text-[13px]"
              >
                {tick.value}
              </text>
            </g>
          ))}

          {segments.map((segment) => {
            const first = segment[0];
            const lastPoint = segment[segment.length - 1];

            if (!first || !lastPoint) {
              return null;
            }

            const linePath = segment
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
              )
              .join(" ");

            return (
              <g key={`${first.x}-${lastPoint.x}`}>
                <path
                  d={`${linePath} L ${lastPoint.x} ${baseline} L ${first.x} ${baseline} Z`}
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
              {labelIndexes.has(index) ? (
                <text
                  x={point.x}
                  y={HEIGHT - 6}
                  textAnchor="middle"
                  className="fill-ink-500 text-[13px]"
                >
                  {point.label}
                </text>
              ) : null}
              <rect
                x={point.x - hitWidth / 2}
                y={PADDING.top}
                width={hitWidth}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={(event) => {
                  setHovered(index);
                  setCursorFromSvg(event);
                }}
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
              {isFiniteChartValue(active.value) ? (
                <circle cx={active.x} cy={active.y} r={4} fill={color} />
              ) : null}
            </>
          ) : null}
        </svg>

        {active && cursor ? (
          <ChartTooltip
            x={cursor.x}
            y={cursor.y}
            text={formatChartCaption(active.label, active.value, unit)}
          />
        ) : null}

        <figcaption className="mt-1 h-6 text-center text-sm text-ink-400">
          {last ? formatChartCaption(last.label, last.value, unit) : null}
        </figcaption>
      </figure>
    );
  },
);

AreaChart.displayName = "AreaChart";
