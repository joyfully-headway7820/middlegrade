# MiddleGrade

Клиент к Journal (`journal.top-academy.ru`) для студентов IT Top College:
средний балл, зачётка, расписание, задания, объявления, оплата.

Все запросы идут через [middlegrade-server](../middlegrade-server) — напрямую к
API Journal браузер обратиться не может.

## Стек

React 19, Vite, TypeScript, Tailwind CSS v4, react-router v7, TanStack Query,
zustand, Recharts, lucide-react.

## Запуск

```bash
npm install
npm run dev
```

Дев-сервер проксирует `/api/*` на `http://localhost:3000` (переопределяется
переменной `API_TARGET`). Прокси должен быть запущен отдельно.

```bash
npm run typecheck   # tsc --noEmit
npm run test        # vitest
npm run build       # typecheck + vite build
```

## Структура

```
src/
  components/
    layout/   AppLayout, боковое меню
    ui/       Card, Stat, Controls, States, Avatar
    Marks/    сетка оценок
  constants/  шкала оценок, фильтры заданий
  lib/        api (fetch-обёртка), queries (TanStack), format, cn
  pages/      Dashboard, Grades, Schedule, Homework, News, Payment, Library, Signals, Login
  store/      auth (zustand)
  types/      контракты API Journal
  utils/      distributeData, distributeVisits, countMiddle, toFive
```

`src/utils` перенесён из первой версии без изменений в логике — тесты в
`__tests__` проверяют его на зафиксированных данных.

## Оценки

До 31 августа 2024 (`FIVE_GRADE_SYSTEM_DATE`) журнал использовал 12-балльную
шкалу. `toFive` приводит такие оценки к пятибалльным, `distributeData` применяет
это по дате занятия, поэтому средний балл считается по одной шкале.

## Авторизация

Логин и пароль отправляются на прокси один раз. В браузере не сохраняется ничего:
сессия — зашифрованная httpOnly-cookie на стороне прокси. Из-за этого прокси
должен быть доступен на том же origin, что и фронт — за это отвечает rewrite
`/api/*` в `vercel.json`.

## Деплой

`vercel.json` содержит два правила: `/api/*` уходит на прокси, всё остальное
отдаётся как SPA. Домен прокси прописан в `vercel.json` — при переезде его нужно
поменять там.
