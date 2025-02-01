export function toFive(num: number | null): number | null {
  switch (num) {
    case 1:
      return 1;
    case 2:
    case 3:
      return 2;
    case 4:
    case 5:
    case 6:
      return 3;
    case 7:
    case 8:
    case 9:
      return 4;
    case 10:
    case 11:
    case 12:
      return 5;
    default:
      return null;
  }
}
