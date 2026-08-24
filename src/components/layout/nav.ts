import {
  CalendarDays,
  CreditCard,
  Ellipsis,
  GraduationCap,
  Home,
  MessageSquareQuote,
  NotebookPen,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export type TabItem = NavItem & {
  featured?: boolean;
};

const HOME: NavItem = { to: "/", label: "Главная", icon: Home };
const GRADES: NavItem = { to: "/grades", label: "Оценки", icon: GraduationCap };
const SCHEDULE: NavItem = {
  to: "/schedule",
  label: "Расписание",
  icon: CalendarDays,
};
const HOMEWORK: NavItem = {
  to: "/homework",
  label: "Задания",
  icon: NotebookPen,
};
const REVIEWS: NavItem = {
  to: "/reviews",
  label: "Отзывы",
  icon: MessageSquareQuote,
};
const MARKET: NavItem = { to: "/market", label: "Маркет", icon: Store };
const PAYMENT: NavItem = { to: "/payment", label: "Оплата", icon: CreditCard };
const MORE: NavItem = { to: "/more", label: "Другое", icon: Ellipsis };

export const NAV_ITEMS: NavItem[] = [
  HOME,
  GRADES,
  SCHEDULE,
  HOMEWORK,
  REVIEWS,
  MARKET,
  PAYMENT,
];

export const TAB_ITEMS: TabItem[] = [
  SCHEDULE,
  GRADES,
  { ...HOME, featured: true },
  HOMEWORK,
  MORE,
];

export const MORE_LINKS: NavItem[] = [REVIEWS, MARKET, PAYMENT];

const MORE_PATHS = new Set(["/more", ...MORE_LINKS.map((item) => item.to)]);

export const isMorePath = (pathname: string) => MORE_PATHS.has(pathname);
