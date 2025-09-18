export function countMiddle(sum: number, arr: (number | null)[]): number {
  if (arr.length) {
    return +(sum / arr.length).toFixed(4);
  }
  return 0;
}
