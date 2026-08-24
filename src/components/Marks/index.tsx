import { useMemo, useState } from "react";
import { Lesson } from "./Lesson";
import { Button } from "@/components/ui/Controls";
import { Pagination } from "@/components/ui/Pagination";
import {
  LESSONS_LOAD_MORE,
  LESSONS_PER_PAGE,
  MARK_KINDS,
} from "@/constants/constants";
import type { StudentVisit } from "@/types";
import { toLessonRows } from "@/utils/toLessonRows";

type MarksProps = {
  marks: StudentVisit[];
};

const Marks = ({ marks }: MarksProps) => {
  const [page, setPage] = useState(1);
  const [extra, setExtra] = useState(0);
  const [renderedMarks, setRenderedMarks] = useState(marks);

  if (renderedMarks !== marks) {
    setRenderedMarks(marks);
    setPage(1);
    setExtra(0);
  }

  const lessons = useMemo(() => toLessonRows(marks), [marks]);

  const pageCount = Math.max(1, Math.ceil(lessons.length / LESSONS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * LESSONS_PER_PAGE;
  const remainingAfterStart = Math.max(0, lessons.length - start);
  const visibleCount = Math.min(LESSONS_PER_PAGE + extra, remainingAfterStart);
  const visible = lessons.slice(start, start + visibleCount);
  const remaining = remainingAfterStart - visibleCount;
  const step = Math.min(LESSONS_LOAD_MORE, remaining);

  if (lessons.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-ink-500">
        Занятий пока нет
      </p>
    );
  }

  const changePage = (next: number) => {
    setPage(next);
    setExtra(0);
  };

  return (
    <div className="flex flex-col gap-4">
      <ul className="-mx-5 flex flex-col">
        {visible.map(({ visit, number }) => (
          <Lesson
            key={`${visit.date_visit}-${visit.lesson_number}-${visit.spec_id}-${number}`}
            visit={visit}
            number={number}
          />
        ))}
      </ul>

      {lessons.length > LESSONS_PER_PAGE ? (
        <div className="flex flex-col items-center gap-3">
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onChange={changePage}
          />
          {remaining > 0 ? (
            <Button
              variant="outline"
              onClick={() => setExtra((count) => count + step)}
            >
              Показать ещё
            </Button>
          ) : null}
        </div>
      ) : null}

      <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4">
        {MARK_KINDS.map((kind) => (
          <li
            key={kind.key}
            className="flex items-center gap-2 text-xs text-ink-400"
          >
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ backgroundColor: kind.color }}
            />
            {kind.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Marks;
