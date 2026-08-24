import type { HomeworkItem, HomeworkList } from "@/types";

export const flattenHomeworkPages = (pages: HomeworkList[]): HomeworkItem[] => {
  const seen = new Set<number>();
  const items: HomeworkItem[] = [];

  for (const page of pages) {
    for (const item of page.items) {
      if (seen.has(item.id)) {
        continue;
      }

      seen.add(item.id);
      items.push(item);
    }
  }

  return items;
};
