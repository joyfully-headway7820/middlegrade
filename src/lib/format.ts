const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
});

const dateWithYearFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
});

const shortMonthFormatter = new Intl.DateTimeFormat("ru-RU", { month: "short" });

const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const toDate = (value: string | Date): Date =>
  value instanceof Date ? value : new Date(value);

export const formatDate = (value: string | Date) => dateFormatter.format(toDate(value));

export const formatFullDate = (value: string | Date) =>
  dateWithYearFormatter.format(toDate(value));

export const formatMonth = (value: string | Date) => monthFormatter.format(toDate(value));

export const formatShortMonth = (value: string | Date) =>
  shortMonthFormatter.format(toDate(value)).replace(".", "");

export const formatMoney = (value: number) => moneyFormatter.format(value);

export const formatGrade = (value: number, digits = 2) =>
  value.toFixed(digits).replace(".", ",");

export const formatPercent = (value: number, digits = 2) =>
  `${value.toFixed(digits).replace(".", ",")}%`;

export const formatSigned = (value: number) =>
  value > 0 ? `+${value}` : String(value);

export const formatChartCaption = (
  label: string,
  value: number | null,
  unit?: string,
) => {
  if (value === null || !Number.isFinite(value)) {
    return `${label}: нет данных`;
  }

  return unit ? `${label}: ${value} ${unit}` : `${label}: ${value}`;
};

export const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

/** Понедельник недели, содержащей переданную дату. */
export const startOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;

  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);

  return result;
};

export const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** "09:00:00" -> "09:00" */
export const formatTime = (value: string) => value.slice(0, 5);

/** "2026-06-17" -> "17.06.2026" */
export const formatNumericDate = (value: string) =>
  value.slice(0, 10).split("-").reverse().join(".");
