const DAY_MS = 1000 * 60 * 60 * 24;

/** Задание считаем новым, если оно появилось сегодня или вчера. */
export const isRecent = (value: string, days = 2, now = new Date()): boolean => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return now.getTime() - date.getTime() < days * DAY_MS;
};
