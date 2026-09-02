import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type StarRatingProps = {
  value: number | null;
  onChange: (value: number) => void;
  label: string;
};

export const StarRating = ({ value, onChange, label }: StarRatingProps) => (
  <div role="group" aria-label={label} className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => {
      const active = value !== null && star <= value;

      return (
        <button
          key={star}
          type="button"
          aria-label={`${star} из 5`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
            active ? "text-brand-400" : "text-ink-500 hover:text-ink-300",
          )}
        >
          <Star
            className="size-8"
            aria-hidden
            fill={active ? "currentColor" : "none"}
          />
        </button>
      );
    })}
  </div>
);
