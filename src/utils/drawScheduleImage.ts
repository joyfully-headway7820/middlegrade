import { WEEKDAYS_FULL } from "@/constants/constants";
import { formatNumericDate, formatTime } from "@/lib/format";
import type { ScheduleLesson } from "@/types";
import {
  buildScheduleWeekTable,
  scheduleCellKey,
} from "@/utils/buildScheduleWeekTable";
import {
  SCHEDULE_IMAGE_CREDIT,
  SCHEDULE_IMAGE_SITE,
  wrapCanvasText,
} from "@/utils/scheduleImage";

type ScheduleImageColors = {
  canvas: string;
  surface: string;
  heading: string;
  muted: string;
  brand: string;
  brandDeep: string;
  white: string;
};

type DrawScheduleImageInput = {
  start: Date;
  dayCount: number;
  lessons: ScheduleLesson[];
  groupName?: string | null;
  rangeLabel: string;
  colors: ScheduleImageColors;
};

type CellLines = {
  time: string;
  subject: string[];
  room: string[];
  teacher: string[];
};

const SUBJECT_FONT = "700 13px Inter, system-ui, sans-serif";
const META_FONT = "500 11px Inter, system-ui, sans-serif";
const SUBJECT_LINE = 17;
const META_LINE = 14;

const weekdayName = (date: Date) => WEEKDAYS_FULL[(date.getDay() + 6) % 7];

const emptyCell = (): CellLines => ({
  time: "",
  subject: [],
  room: [],
  teacher: [],
});

const cellHeight = (lines: CellLines) => {
  if (!lines.time) {
    return 76;
  }

  return (
    10 +
    16 +
    lines.subject.length * SUBJECT_LINE +
    8 +
    lines.room.length * META_LINE +
    lines.teacher.length * META_LINE +
    10
  );
};

export const readScheduleImageColors = (): ScheduleImageColors => {
  const styles = getComputedStyle(document.documentElement);

  return {
    canvas: styles.getPropertyValue("--canvas").trim() || "#080a12",
    surface: styles.getPropertyValue("--surface").trim() || "#12141f",
    heading: styles.getPropertyValue("--heading").trim() || "#f3f5fb",
    muted: styles.getPropertyValue("--ink-400").trim() || "#8189a8",
    brand: "#7024f7",
    brandDeep: "#5f16dc",
    white: "#ffffff",
  };
};

export const drawScheduleImage = (input: DrawScheduleImageInput): Promise<Blob> => {
  const table = buildScheduleWeekTable(input.start, input.lessons, input.dayCount);
  const scale = Math.max(window.devicePixelRatio ?? 1, 2);
  const pad = 32;
  const slotW = 48;
  const colW = input.dayCount === 1 ? 560 : 172;
  const titleH = input.groupName ? 118 : 96;
  const footerH = 56;
  const headH = 54;
  const cellPad = 10;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return Promise.reject(new Error("canvas"));
  }

  const measureWith = (font: string, text: string) => {
    ctx.font = font;
    return ctx.measureText(text).width;
  };

  const cellLines = (lesson: ScheduleLesson | undefined, width: number): CellLines => {
    if (!lesson) {
      return emptyCell();
    }

    return {
      time: `${formatTime(lesson.started_at)}–${formatTime(lesson.finished_at)}`,
      subject: wrapCanvasText(
        (text) => measureWith(SUBJECT_FONT, text),
        lesson.subject_name,
        width,
      ),
      room: wrapCanvasText((text) => measureWith(META_FONT, text), lesson.room_name, width),
      teacher: wrapCanvasText(
        (text) => measureWith(META_FONT, text),
        lesson.teacher_name,
        width,
      ),
    };
  };

  const textW = colW - cellPad * 2;
  const layouts = table.slots.map((slot) =>
    table.days.map((day) =>
      cellLines(table.cells.get(scheduleCellKey(day.iso, slot)), textW),
    ),
  );
  const innerW = slotW + colW * table.days.length;
  const rowHeights = layouts.map((row) =>
    row.reduce((height, lines) => Math.max(height, cellHeight(lines)), 76),
  );

  const width = pad * 2 + innerW;
  const height =
    pad * 2 + titleH + headH + rowHeights.reduce((sum, row) => sum + row, 0) + footerH;

  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  ctx.scale(scale, scale);

  ctx.fillStyle = input.colors.canvas;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = input.colors.brand;
  ctx.font = "700 12px Inter, system-ui, sans-serif";
  ctx.fillText("MIDDLEGRADE", pad, pad + 18);

  ctx.fillStyle = input.colors.heading;
  ctx.font = "700 26px Inter, system-ui, sans-serif";
  ctx.fillText("Расписание", pad, pad + 50);

  ctx.fillStyle = input.colors.muted;
  ctx.font = "500 14px Inter, system-ui, sans-serif";
  ctx.fillText(input.rangeLabel, pad, pad + 74);

  if (input.groupName) {
    ctx.fillText(input.groupName, pad, pad + 92);
  }

  const tableTop = pad + titleH;
  const tableLeft = pad;

  table.days.forEach((day, index) => {
    const x = tableLeft + slotW + index * colW;
    ctx.fillStyle = input.colors.brand;
    ctx.fillRect(x, tableTop, colW, headH);
    ctx.fillStyle = input.colors.white;
    ctx.font = "700 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(weekdayName(day.date).toLowerCase(), x + colW / 2, tableTop + 22);
    ctx.font = "500 11px Inter, system-ui, sans-serif";
    ctx.fillText(formatNumericDate(day.iso), x + colW / 2, tableTop + 40);
    ctx.textAlign = "left";
  });

  ctx.fillStyle = input.colors.brandDeep;
  ctx.fillRect(tableLeft, tableTop, slotW, headH);

  let y = tableTop + headH;
  table.slots.forEach((slot, rowIndex) => {
    const rowH = rowHeights[rowIndex];
    ctx.fillStyle = input.colors.brand;
    ctx.fillRect(tableLeft, y, slotW, rowH);
    ctx.fillStyle = input.colors.white;
    ctx.font = "700 16px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(slot), tableLeft + slotW / 2, y + rowH / 2 + 5);
    ctx.textAlign = "left";

    table.days.forEach((_, index) => {
      const x = tableLeft + slotW + index * colW;
      ctx.fillStyle = input.colors.surface;
      ctx.fillRect(x, y, colW, rowH);
      ctx.strokeStyle = input.colors.brandDeep;
      ctx.globalAlpha = 0.35;
      ctx.strokeRect(x + 0.5, y + 0.5, colW - 1, rowH - 1);
      ctx.globalAlpha = 1;

      const lines = layouts[rowIndex][index];
      if (!lines.time) {
        return;
      }

      let textY = y + cellPad + 14;
      ctx.fillStyle = input.colors.muted;
      ctx.font = META_FONT;
      ctx.fillText(lines.time, x + cellPad, textY);
      textY += 18;
      ctx.fillStyle = input.colors.heading;
      ctx.font = SUBJECT_FONT;
      for (const line of lines.subject) {
        ctx.fillText(line, x + cellPad, textY);
        textY += SUBJECT_LINE;
      }
      ctx.fillStyle = input.colors.muted;
      ctx.font = META_FONT;
      textY += 4;
      for (const line of lines.room) {
        ctx.fillText(line, x + cellPad, textY);
        textY += META_LINE;
      }
      for (const line of lines.teacher) {
        ctx.fillText(line, x + cellPad, textY);
        textY += META_LINE;
      }
    });

    y += rowH;
  });

  ctx.fillStyle = input.colors.muted;
  ctx.font = "600 13px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(SCHEDULE_IMAGE_CREDIT, width / 2, height - pad - 18);
  ctx.fillStyle = input.colors.brand;
  ctx.font = "500 12px Inter, system-ui, sans-serif";
  ctx.fillText(SCHEDULE_IMAGE_SITE, width / 2, height - pad);
  ctx.textAlign = "left";

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("blob"));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
};
