import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { formatFullDate } from "@/lib/format";
import { reviewsQuery } from "@/lib/queries";
import { sortReviews } from "@/utils/sortReviews";

export const ReviewsPage = () => {
  const reviews = useQuery(reviewsQuery());
  const items = useMemo(
    () => sortReviews(reviews.data ?? []),
    [reviews.data],
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-heading">
        Отзывы
      </h1>

      {reviews.isPending ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
      ) : reviews.isError ? (
        <ErrorState
          message="Не удалось загрузить отзывы"
          onRetry={() => void reviews.refetch()}
        />
      ) : items.length === 0 ? (
        <Card>
          <EmptyState title="Отзывов пока нет" />
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((review, index) => (
            <li
              key={`${review.date}-${review.teacher}-${index}`}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-heading">
                  {review.teacher}
                  {review.spec || review.full_spec ? (
                    <span className="font-normal text-ink-400">
                      {" "}
                      ({review.full_spec || review.spec})
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-ink-500">
                  {review.date ? formatFullDate(review.date) : "—"}
                </p>
              </div>
              <p className="mt-3 text-sm break-words text-ink-200">
                {review.message || "Без комментария"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
