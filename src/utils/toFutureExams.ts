import type { FutureExam } from "@/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const asDate = (value: unknown): string | null => {
  const raw = asString(value);
  if (!raw) {
    return null;
  }

  const iso = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) {
    return iso[1];
  }

  const dotted = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (dotted) {
    return `${dotted[3]}-${dotted[2]}-${dotted[1]}`;
  }

  return raw;
};

const rowsOf = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (isRecord(value) && Array.isArray(value.data)) {
    return value.data;
  }

  return [];
};

const toFutureExam = (value: unknown): FutureExam | null => {
  if (!isRecord(value)) {
    return null;
  }

  const spec =
    asString(value.spec) ??
    asString(value.spec_name) ??
    asString(value.subject_name) ??
    asString(value.name_spec) ??
    asString(value.subject);

  if (!spec) {
    return null;
  }

  return {
    spec,
    teacher:
      asString(value.teacher) ??
      asString(value.teacher_name) ??
      asString(value.fio_teach),
    date: asDate(value.date) ?? asDate(value.exam_date),
    exam:
      asString(value.exam) ??
      asString(value.exam_name) ??
      asString(value.exam_type),
  };
};

const byDate = (left: FutureExam, right: FutureExam) => {
  if (!left.date && !right.date) {
    return 0;
  }

  if (!left.date) {
    return 1;
  }

  if (!right.date) {
    return -1;
  }

  return left.date.localeCompare(right.date);
};

export const toFutureExams = (value: unknown): FutureExam[] =>
  rowsOf(value)
    .map(toFutureExam)
    .filter((exam): exam is FutureExam => exam != null)
    .sort(byDate);
