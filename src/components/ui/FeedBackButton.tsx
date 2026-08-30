import { MessageSquareMore } from "lucide-react";
import { cn } from "@/lib/cn";

const FEEDBACK_HREF =
  "https://github.com/joyfully-headway7820/middlegrade/issues/new";

type FeedBackButtonProps = {
  variant?: "fab" | "header";
};

export const FeedBackButton = ({ variant = "fab" }: FeedBackButtonProps) => {
  if (variant === "header") {
    return (
      <a
        href={FEEDBACK_HREF}
        target="_blank"
        rel="noreferrer"
        aria-label="Оставить обратную связь"
        className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading"
      >
        <MessageSquareMore className="size-5" aria-hidden />
      </a>
    );
  }

  return (
    <a
      href={FEEDBACK_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="Оставить обратную связь"
      className={cn(
        "fixed right-5 bottom-5 hidden h-12.5 w-12.5 items-center justify-center rounded-full bg-brand-600 font-bold text-white shadow-md transition-all",
        "hover:w-70 hover:bg-brand-500 hover:shadow-lg lg:flex",
        "group",
      )}
    >
      <MessageSquareMore size={25} aria-hidden />
      <span className="ml-3 hidden text-nowrap group-hover:inline font-medium">
        Оставьте обратную связь
      </span>
    </a>
  );
};
