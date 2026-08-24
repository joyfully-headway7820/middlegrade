import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Coins, Gem, LogOut, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { NAV_ITEMS } from "./nav";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Counter } from "@/components/ui/Controls";
import { GamingPointTypes, HOMEWORK_STATUS } from "@/constants/constants";
import { request } from "@/lib/api";
import { cn } from "@/lib/cn";
import { homeworkCountsQuery } from "@/lib/queries";
import { useAuthStore } from "@/store/auth";

const Brand = () => (
  <div className="flex items-center gap-2.5 px-2">
    <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white">
      <Sparkles className="size-4.5" aria-hidden />
    </span>
    <span className="text-base font-semibold tracking-tight text-heading">
      MiddleGrade
    </span>
  </div>
);

type NavListProps = {
  badges: Record<string, number>;
  onNavigate?: () => void;
};

const NavList = ({ badges, onNavigate }: NavListProps) => (
  <nav aria-label="Разделы" className="flex flex-col gap-1">
    {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
      const badge = badges[to] ?? 0;

      return (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-600/15 text-heading"
                : "text-ink-400 hover:bg-overlay hover:text-heading",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span className="relative shrink-0">
                <Icon
                  className={cn("size-4.5", isActive && "text-brand-300")}
                  aria-hidden
                />
                {badge ? (
                  <span className="absolute -top-2 -right-2.5">
                    <Counter value={badge} label={`Новых заданий: ${badge}`} />
                  </span>
                ) : null}
              </span>
              <span className="truncate">{label}</span>
            </>
          )}
        </NavLink>
      );
    })}
  </nav>
);

const pointsByType = (
  points: { new_gaming_point_types__id: number; points: number }[] | undefined,
  typeId: number,
) =>
  points?.find((entry) => entry.new_gaming_point_types__id === typeId)
    ?.points ?? 0;

export const AppLayout = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const homeworkCounts = useQuery(homeworkCountsQuery());

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const logout = useMutation({
    mutationFn: () => request<void>("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });

  const coins = pointsByType(user?.gaming_points, GamingPointTypes.Gems);
  const gems = pointsByType(user?.gaming_points, GamingPointTypes.Coins);

  const badges = useMemo(() => {
    const list = Array.isArray(homeworkCounts.data) ? homeworkCounts.data : [];
    const active =
      list.find((entry) => entry.counter_type === HOMEWORK_STATUS.ACTIVE)
        ?.counter ?? 0;

    return { "/homework": active };
  }, [homeworkCounts.data]);

  return (
    <div className="flex min-h-full">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r border-line px-3 py-5 lg:flex">
        <Brand />
        <NavList badges={badges} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-canvas px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            className="rounded-lg p-2 text-ink-300 transition-colors hover:bg-overlay hover:text-heading lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>

          <div className="lg:hidden">
            <Brand />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {coins > 0 || gems > 0 ? (
              <span className="hidden items-center gap-3 rounded-full border border-line px-3 py-1.5 text-sm text-ink-200 tabular-nums sm:inline-flex">
                {coins > 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span>{coins}</span>
                    <Coins
                      className="size-4 text-amber-400"
                      aria-label="Топкоины"
                    />
                  </span>
                ) : null}
                {gems > 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span>{gems}</span>
                    <Gem
                      className="size-4 text-emerald-400"
                      aria-label="Гемы"
                    />
                  </span>
                ) : null}
              </span>
            ) : null}

            {user ? (
              <div className="flex items-center gap-2.5">
                <Avatar name={user.full_name} src={user.photo} />
                <div className="hidden min-w-0 leading-tight sm:block">
                  <p className="truncate text-sm font-medium text-heading">
                    {user.full_name}
                  </p>
                  <p className="truncate text-xs text-ink-500">
                    {user.group_name}
                  </p>
                </div>
              </div>
            ) : null}

            <ThemeToggle />

            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              aria-label="Выйти"
              className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-overlay hover:text-heading disabled:opacity-50"
            >
              <LogOut className="size-4.5" aria-hidden />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-scrim"
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col gap-6 border-r border-line bg-surface px-3 py-5">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Закрыть меню"
                className="rounded-lg p-2 text-ink-400 hover:bg-overlay hover:text-heading"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <NavList badges={badges} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
