import { useMemo, useState } from "react";
import { Lesson } from "./Lesson";
import { Button } from "@/components/ui/Controls";
import { Pagination } from "@/components/ui/Pagination";
import { LESSONS_PER_PAGE, MARK_KINDS } from "@/constants/constants";
import type { StudentVisit } from "@/types";
import { toLessonRows } from "@/utils/toLessonRows";

type MarksProps = {
  marks: StudentVisit[];
};

const Marks = ({ marks }: MarksProps) => {
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [renderedMarks, setRenderedMarks] = useState(marks);

  if (renderedMarks !== marks) {
    setRenderedMarks(marks);
    setPage(1);
    setShowAll(false);
  }

  const lessons = useMemo(() => toLessonRows(marks), [marks]);

  const pageCount = Math.max(1, Math.ceil(lessons.length / LESSONS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);

  const visible = showAll
    ? lessons
    : lessons.slice((currentPage - 1) * LESSONS_PER_PAGE, currentPage * LESSONS_PER_PAGE);

  if (lessons.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-ink-500">Занятий пока нет</p>;
  }

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
          {showAll ? null : (
            <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
          )}
          <Button variant="outline" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? "Постранично" : `Показать все (${lessons.length})`}
          </Button>
        </div>
      ) : null}

      <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4">
        {MARK_KINDS.map((kind) => (
          <li key={kind.key} className="flex items-center gap-2 text-xs text-ink-400">
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
