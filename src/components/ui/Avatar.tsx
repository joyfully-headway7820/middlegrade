import { useState } from "react";
import { cn } from "@/lib/cn";

const initials = (name: string | null | undefined) => {
  if (!name) {
    return "";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

type AvatarProps = {
  name: string | null | undefined;
  src?: string | null;
  className?: string;
};

export const Avatar = ({ name, src, className }: AvatarProps) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600/25 text-xs font-semibold text-brand-100",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </span>
  );
};
