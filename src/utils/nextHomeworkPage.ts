import type { HomeworkList } from "@/types";

export const nextHomeworkPage = (page: HomeworkList): number | undefined =>
  page.page < page.totalPages ? page.page + 1 : undefined;
