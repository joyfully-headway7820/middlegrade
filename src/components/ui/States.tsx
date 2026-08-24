import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn("animate-pulse rounded-lg bg-overlay", className)}
  />
);

export const Spinner = ({ label = "Загрузка" }: { label?: string }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex items-center justify-center gap-2 py-10 text-sm text-ink-400"
  >
    <Loader2 className="size-4 animate-spin" aria-hidden />
    <span>{label}…</span>
  </div>
);

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
};

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
    <div className="text-ink-500" aria-hidden>
      {icon ?? <Inbox className="size-7" />}
    </div>
    <p className="text-sm font-medium text-ink-200">{title}</p>
    {description ? (
      <p className="max-w-sm text-sm text-ink-500">{description}</p>
    ) : null}
  </div>
);

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center"
  >
    <AlertTriangle className="size-7 text-bad" aria-hidden />
    <p className="max-w-md text-sm text-ink-300">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-200 transition-colors hover:border-line hover:text-heading"
      >
        Повторить
      </button>
    ) : null}
  </div>
);
