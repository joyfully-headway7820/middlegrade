import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

const pagesAround = (page: number, pageCount: number): (number | "gap")[] => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set([1, pageCount, page, page - 1, page + 1]);
  const visible = [...pages].filter((value) => value >= 1 && value <= pageCount).sort((a, b) => a - b);

  return visible.flatMap((value, index) =>
    index > 0 && value - visible[index - 1] > 1 ? ["gap" as const, value] : [value],
  );
};

export const Pagination = ({ page, pageCount, onChange }: PaginationProps) => {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav aria-label="Страницы" className="flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        aria-label="Предыдущая страница"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>

      {pagesAround(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1.5 text-sm text-ink-600">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            onClick={() => onChange(item)}
            className={cn(
              "min-w-9 rounded-lg px-2.5 py-1.5 text-sm font-medium tabular-nums transition-colors",
              item === page
                ? "bg-brand-600 text-white"
                : "text-ink-400 hover:bg-overlay hover:text-ink-100",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Следующая страница"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
};
