import {
  CalendarDays,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
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

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Главная", icon: LayoutDashboard },
  { to: "/grades", label: "Оценки", icon: GraduationCap },
  { to: "/schedule", label: "Расписание", icon: CalendarDays },
  { to: "/homework", label: "Задания", icon: NotebookPen },
  { to: "/reviews", label: "Отзывы", icon: MessageSquareQuote },
  { to: "/market", label: "Маркет", icon: Store },
  { to: "/payment", label: "Оплата", icon: CreditCard },
];
