import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => (
  <section
    className={cn("rounded-2xl border border-line bg-surface", className)}
  >
    {children}
  </section>
);

type CardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export const CardHeader = ({
  title,
  description,
  action,
  className,
}: CardHeaderProps) => (
  <header
    className={cn(
      "flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4",
      className,
    )}
  >
    <div className="min-w-0">
      <h2 className="text-sm font-semibold tracking-wide text-ink-100">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm text-ink-400">{description}</p>
      ) : null}
    </div>
    {action}
  </header>
);

export const CardBody = ({ children, className }: CardProps) => (
  <div className={cn("p-5", className)}>{children}</div>
);
