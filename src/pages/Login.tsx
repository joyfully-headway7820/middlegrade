import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { ThemePicker } from "@/components/layout/ThemePicker";
import { Button, TextField } from "@/components/ui/Controls";
import { ApiError, request } from "@/lib/api";
import { persistQueryCache } from "@/lib/persistQueryCache";
import { useAuthStore } from "@/store/auth";
import type { UserInfo } from "@/types";

export const LoginPage = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const login = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      request<{ user: UserInfo }>("/auth/login", {
        method: "POST",
        body: credentials,
      }),
    onSuccess: ({ user }) => {
      setUser(user);
      queryClient.clear();
      queryClient.setQueryData(["me"], user);
      void persistQueryCache(queryClient);
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.trim().length < 3) {
      setFieldError("Введите логин от Journal");
      return;
    }

    if (password.length < 2) {
      setFieldError("Введите пароль");
      return;
    }

    setFieldError(null);
    login.mutate({ username: username.trim(), password });
  };

  const serverError =
    login.error instanceof ApiError
      ? login.error.message
      : login.error
        ? "Не удалось связаться с сервером"
        : null;

  return (
    <div className="relative grid min-h-full place-items-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemePicker className="w-40" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-600 text-white">
            <Sparkles className="size-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-heading">
              MiddleGrade
            </h1>
            <p className="mt-1 text-sm text-ink-400">
              Успеваемость из Journal — в человеческом виде
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6"
        >
          <TextField
            label="Логин"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {fieldError || serverError ? (
            <p role="alert" className="text-sm text-bad">
              {fieldError ?? serverError}
            </p>
          ) : null}

          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? "Входим…" : "Войти"}
          </Button>

          <p className="flex items-start gap-2 text-xs text-ink-500">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span>
              Данные нигде не хранятся и не передаются никуда, кроме API
              Journal.
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
