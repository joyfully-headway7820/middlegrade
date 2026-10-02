import type { HomeworkItem } from "@/types";

export type StudentWork =
  | { kind: "file"; url: string }
  | { kind: "comment"; text: string }
  | { kind: "none" };

const nonempty = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
};

export const studentWork = (item: HomeworkItem): StudentWork => {
  const file = nonempty(item.homework_stud?.file_path);

  if (file) return { kind: "file", url: file };

  const text = nonempty(item.homework_stud?.stud_answer);

  if (text) return { kind: "comment", text };

  return { kind: "none" };
};
