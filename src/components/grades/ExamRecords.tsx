import { Badge } from "@/components/ui/Controls";
import { FIVE_GRADE_SYSTEM_DATE } from "@/constants/constants";
import { formatFullDate } from "@/lib/format";
import type { StudentExam } from "@/types";
import { toFive } from "@/utils/toFive";

type ExamRecordsProps = {
  exams: StudentExam[];
};

const gradeTone = (value: number) => {
  if (value >= 4.5) return "good" as const;
  if (value >= 3.5) return "warn" as const;
  return "bad" as const;
};

const examMark = (exam: StudentExam) => {
  if (exam.mark === null) return null;
  if (!exam.date) return exam.mark;

  return new Date(exam.date) < FIVE_GRADE_SYSTEM_DATE
    ? toFive(exam.mark)
    : exam.mark;
};

const markView = (exam: StudentExam) => {
  const mark = examMark(exam);

  if (!mark) {
    return <span className="text-ink-600">—</span>;
  }

  return <Badge tone={gradeTone(mark)}>{mark}</Badge>;
};

export const ExamRecords = ({ exams }: ExamRecordsProps) => (
  <>
    <ul className="flex flex-col md:hidden">
      {exams.map((exam, index) => (
        <li
          key={`${exam.exam_id ?? "exam"}-${index}`}
          className="flex flex-col gap-1 border-b border-line px-5 py-3 last:border-0"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-sm break-words text-ink-100">
              {exam.spec}
            </p>
            <span className="shrink-0">{markView(exam)}</span>
          </div>
          <p className="text-xs break-words text-ink-400">
            {exam.teacher ?? "—"}
          </p>
          <p className="text-xs text-ink-500">
            {exam.date ? formatFullDate(exam.date) : "—"}
          </p>
        </li>
      ))}
    </ul>

    <table className="hidden w-full table-fixed text-left text-sm md:table">
      <thead className="text-xs tracking-wide text-ink-500 uppercase">
        <tr className="border-b border-line">
          <th scope="col" className="w-[38%] px-5 py-3 font-medium">
            Предмет
          </th>
          <th scope="col" className="w-[32%] px-5 py-3 font-medium">
            Преподаватель
          </th>
          <th scope="col" className="w-[18%] px-5 py-3 font-medium">
            Дата
          </th>
          <th scope="col" className="w-[12%] px-5 py-3 text-right font-medium">
            Оценка
          </th>
        </tr>
      </thead>
      <tbody>
        {exams.map((exam, index) => (
          <tr
            key={`${exam.exam_id ?? "exam"}-row-${index}`}
            className="border-b border-line last:border-0"
          >
            <td className="px-5 py-3 break-words text-ink-100">{exam.spec}</td>
            <td className="px-5 py-3 break-words text-ink-400">
              {exam.teacher ?? "—"}
            </td>
            <td className="px-5 py-3 text-ink-400">
              {exam.date ? formatFullDate(exam.date) : "—"}
            </td>
            <td className="px-5 py-3 text-right">{markView(exam)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
