import { Badge } from "@/components/ui/Controls";
import { formatFullDate } from "@/lib/format";
import type { FutureExam } from "@/types";

type FutureExamRowProps = {
  exam: FutureExam;
};

export const FutureExamRow = ({ exam }: FutureExamRowProps) => (
  <li className="flex items-start justify-between gap-3 border-b border-line px-5 py-3 last:border-0">
    <div className="min-w-0">
      <p className="text-sm break-words text-ink-100">{exam.spec}</p>
      <p className="mt-0.5 text-xs break-words text-ink-400">
        {exam.teacher ?? "—"}
      </p>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-1">
      {exam.exam ? <Badge>{exam.exam}</Badge> : null}
      <p className="text-xs text-ink-500">
        {exam.date ? formatFullDate(exam.date) : "—"}
      </p>
    </div>
  </li>
);
