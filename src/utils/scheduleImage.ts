export const SCHEDULE_IMAGE_CREDIT = "Сделано в MiddleGrade";
export const SCHEDULE_IMAGE_SITE = "middlegrade.vercel.app";
export const SCHEDULE_IMAGE_SITE_URL = `https://${SCHEDULE_IMAGE_SITE}`;

export const scheduleImageFileName = (startIso: string, endIso: string) =>
  startIso === endIso
    ? `raspisanie-${startIso}.png`
    : `raspisanie-${startIso}-${endIso}.png`;

export const wrapCanvasText = (
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
) => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  const breakWord = (word: string) => {
    if (measure(word) <= maxWidth) {
      return [word];
    }

    const parts: string[] = [];
    let chunk = "";

    for (const char of word) {
      const next = chunk + char;
      if (chunk && measure(next) > maxWidth) {
        parts.push(chunk);
        chunk = char;
        continue;
      }

      chunk = next;
    }

    if (chunk) {
      parts.push(chunk);
    }

    return parts;
  };

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (measure(next) <= maxWidth) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    const parts = breakWord(word);
    current = parts.pop() ?? "";
    lines.push(...parts);
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};
