import { useQuery } from "@tanstack/react-query";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Controls";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import { Stat } from "@/components/ui/Stat";
import { formatFullDate, formatMoney } from "@/lib/format";
import {
  paymentHistoryQuery,
  paymentQuery,
  paymentScheduleQuery,
} from "@/lib/queries";

export const PaymentPage = () => {
  const payment = useQuery(paymentQuery());
  const history = useQuery(paymentHistoryQuery());
  const schedule = useQuery(paymentScheduleQuery());

  const info = payment.data?.payment ?? null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-heading">Оплата</h1>

      {payment.isPending ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : payment.isError ? (
        <ErrorState
          message="Не удалось загрузить данные об оплате"
          onRetry={() => void payment.refetch()}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat
            label="К оплате"
            value={info ? formatMoney(info.amount_to_pay) : "—"}
            hint={info?.pay_date_start ? `с ${formatFullDate(info.pay_date_start)}` : undefined}
          />
          <Stat
            label="Следующий платёж"
            value={info ? formatMoney(info.amount_next) : "—"}
          />
          <Stat
            label="Задолженность"
            value={
              info?.amount_debt !== null && info?.amount_debt !== undefined
                ? formatMoney(info.amount_debt)
                : "нет"
            }
          />
        </div>
      )}

      <Card>
        <CardHeader title="График платежей" />
        {schedule.isPending ? (
          <CardBody>
            <Skeleton className="h-32" />
          </CardBody>
        ) : schedule.isError ? (
          <ErrorState
            message="График недоступен"
            onRetry={() => void schedule.refetch()}
          />
        ) : schedule.data.length === 0 ? (
          <EmptyState title="Платежей не запланировано" />
        ) : (
          <ul className="flex flex-col">
            {schedule.data.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-100">{entry.description}</p>
                  <p className="text-xs text-ink-500">
                    {formatFullDate(entry.payment_date)}
                  </p>
                </div>
                <span className="text-sm font-medium text-ink-100 tabular-nums">
                  {formatMoney(entry.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader title="История" />
        {history.isPending ? (
          <CardBody>
            <Skeleton className="h-56" />
          </CardBody>
        ) : history.isError ? (
          <ErrorState
            message="История недоступна"
            onRetry={() => void history.refetch()}
          />
        ) : history.data.length === 0 ? (
          <EmptyState title="Операций пока нет" />
        ) : (
          <ul className="flex flex-col">
            {history.data.map((entry, index) => (
              <li
                key={`${entry.date}-${index}`}
                className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-100">{entry.description}</p>
                  <p className="text-xs text-ink-500">{formatFullDate(entry.date)}</p>
                </div>
                <Badge tone={entry.amount >= 0 ? "good" : "neutral"}>
                  {formatMoney(entry.amount)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
