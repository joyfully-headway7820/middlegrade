/** «Информатика РПО 2» -> «Информатика»: журнал добавляет к предмету код группы. */
export const removeGroupPostfix = (name: string): string =>
  name.replace(/\s+(РПО|ГД)(?:\s*\d+)?$/i, "").trim();
