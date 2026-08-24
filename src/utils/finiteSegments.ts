export const finiteSegments = <T extends { value: number | null }>(
  items: T[],
): T[][] => {
  const segments: T[][] = [];
  let current: T[] = [];

  for (const item of items) {
    if (typeof item.value === "number" && Number.isFinite(item.value)) {
      current.push(item);
      continue;
    }

    if (current.length > 0) {
      segments.push(current);
      current = [];
    }
  }

  if (current.length > 0) {
    segments.push(current);
  }

  return segments;
};
