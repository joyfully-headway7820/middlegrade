export const visibleLabelIndexes = (count: number, maxLabels = 6): Set<number> => {
  if (count <= maxLabels) {
    return new Set(Array.from({ length: count }, (_, index) => index));
  }

  const indexes = new Set<number>([0, count - 1]);
  const slots = maxLabels - 1;

  for (let step = 1; step < slots; step += 1) {
    indexes.add(Math.round((step * (count - 1)) / slots));
  }

  return indexes;
};
