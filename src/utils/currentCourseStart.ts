/** Начало текущего учебного года: всё, что позже, относится к текущему курсу. */
export const currentCourseStart = (today = new Date()): Date => {
  const year = today.getFullYear();

  return new Date(today.getMonth() >= 8 ? `${year}-08-31` : `${year - 1}-08-31`);
};
