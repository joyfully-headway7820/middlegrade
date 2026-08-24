export const ratioPercent = (count: number, total: number): number => {
  if (total <= 0) return 0;

  return (count / total) * 100;
};
