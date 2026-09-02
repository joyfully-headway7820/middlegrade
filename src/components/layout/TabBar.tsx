import { Link, matchPath, useLocation } from "react-router";
import { isMorePath, TAB_ITEMS, type TabItem } from "./nav";
import { Counter } from "@/components/ui/Controls";
import { cn } from "@/lib/cn";

type TabBarProps = {
  badges: Record<string, number>;
};

const isTabActive = (item: TabItem, pathname: string) =>
  item.to === "/more"
    ? isMorePath(pathname)
    : Boolean(matchPath({ path: item.to, end: item.to === "/" }, pathname));

export const TabBar = ({ badges }: TabBarProps) => {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {TAB_ITEMS.map((item) => {
          const badge = badges[item.to] ?? 0;
          const active = isTabActive(item, pathname);
          const Icon = item.icon;

          return (
            <li key={item.to} className="min-w-0">
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 min-w-0 flex-col items-center justify-end gap-1 px-1 pb-2",
                  active ? "text-heading" : "text-ink-400",
                  item.featured && "text-brand-300",
                )}
              >
                <span
                  className={cn(
                    "relative grid size-10 shrink-0 place-items-center",
                    item.featured &&
                      "rounded-2xl bg-brand-600 text-white shadow-[0_8px_20px_rgb(112_36_247_/_0.4)]",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      item.featured
                        ? "text-white"
                        : active
                          ? "text-heading"
                          : "text-ink-400",
                    )}
                    aria-hidden
                  />
                  {badge ? (
                    <span className="absolute -top-1 -right-1">
                      <Counter value={badge} label={`Новых заданий: ${badge}`} />
                    </span>
                  ) : null}
                </span>
                <span className="h-3 w-full truncate text-center text-[10px] leading-3 font-medium">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
