import { useQueries } from "@tanstack/react-query";
import { HOMEWORK_STATUS, HOMEWORK_TYPE } from "@/constants/constants";
import { homeworkQuery } from "@/lib/queries";

/** Количество невыполненных ДЗ и лабораторных для индикаторов в меню и на вкладках. */
export const useHomeworkCounts = (groupId: number | undefined) =>
  useQueries({
    queries: [HOMEWORK_TYPE.HOMEWORK, HOMEWORK_TYPE.LAB].map((type) =>
      homeworkQuery(groupId, type, HOMEWORK_STATUS.ACTIVE),
    ),
    combine: ([homework, labs]) => ({
      homework: homework.data?.items.length ?? 0,
      labs: labs.data?.items.length ?? 0,
      total: (homework.data?.items.length ?? 0) + (labs.data?.items.length ?? 0),
    }),
  });
