export const serverAlias: string =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://backend.middlegrade.ru";

/* Время жизни Cookie - 2,7397260274 лет */
export const COOKIE_EXPIRY_DATE = new Date(Date.now() + 1000 * 60 * 60 * 24);

export const FIVE_GRADE_SYSTEM_DATE = new Date("2024-08-31");
