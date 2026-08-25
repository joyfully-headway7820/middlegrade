export const activityDelta = (action: number, points: number): number => {
  const amount = Math.abs(points);
  return action ? amount : -amount;
};
