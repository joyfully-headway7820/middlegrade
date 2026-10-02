import { useQueries } from "@tanstack/react-query";
import { HOMEWORK_TYPE } from "@/constants/constants";
import { homeworkCountsQuery } from "@/lib/queries";
import type { HomeworkCount } from "@/types";
import { sumHomeworkBadgeCounts } from "@/utils/sumHomeworkBadgeCounts";

const TYPES = [HOMEWORK_TYPE.HOMEWORK, HOMEWORK_TYPE.LAB] as const;

/** Счётчики журнала по группе: бейджи type-switch и число в заголовке секции. */
export const useHomeworkCounts = (groupId: number | undefined) =>
  useQueries({
    queries: TYPES.map((type) => homeworkCountsQuery(groupId, type)),
    combine: (results) => {
      const byType: Record<number, HomeworkCount[] | undefined> = {
        [HOMEWORK_TYPE.HOMEWORK]: results[0].data,
        [HOMEWORK_TYPE.LAB]: results[1].data,
      };
      const homework = sumHomeworkBadgeCounts(byType[HOMEWORK_TYPE.HOMEWORK]);
      const labs = sumHomeworkBadgeCounts(byType[HOMEWORK_TYPE.LAB]);

      return {
        homework,
        labs,
        total: homework + labs,
        byType,
      };
    },
  });
