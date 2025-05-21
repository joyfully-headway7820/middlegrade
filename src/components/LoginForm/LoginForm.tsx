import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useCookies } from "react-cookie";
import styles from "./LoginForm.module.scss";
import { Input } from "../Input/Input.tsx";
import { COOKIE_EXPIRY_DATE, serverAlias } from "../../constants/constants.ts";
import { Lock } from "lucide-react";

const formLoginSchema = z.object({
  username: z.string().min(4, "Введите свой логин от журнала"),
  password: z.string().min(2, "Введите пароль"),
});

type TFormLogin = z.infer<typeof formLoginSchema>;

export const LoginForm = () => {
  const [, setCookie] = useCookies();
  const [responseError, setResponseError] = React.useState(false);
  const form = useForm<TFormLogin>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = async (data: TFormLogin) => {
    try {
      setResponseError(false);
      setCookie("username", data.username.trim(), {
        sameSite: "lax",
        secure: true,
        expires: COOKIE_EXPIRY_DATE,
      });
      setCookie("password", data.password.trim(), {
        sameSite: "lax",
        secure: true,
        expires: COOKIE_EXPIRY_DATE,
      });

      const response = await axios.post(`${serverAlias}/auth/`, {
        username: data.username.trim(),
        password: data.password.trim(),
      });
      if (!response.data) return;

      const { token } = response.data;

      setCookie("access_token", token, {
        sameSite: "lax",
        secure: true,
        expires: COOKIE_EXPIRY_DATE,
      });
    } catch (e) {
      setResponseError(true);
      console.error(`OnSubmitLoginForm: ${e}`);
    }
  };

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      form.reset();
    }
  });
  return (
    <FormProvider {...form}>
      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.loginForm__title}>Привет</h1>
        <h2 className={styles.loginForm__subtitle}>
          Введи логин и пароль от Journal, чтобы увидеть свою статистику.
        </h2>
        <Input
          className={styles.loginForm__input}
          {...register("username")}
          placeholder="Логин"
        />
        <Input
          className={styles.loginForm__input}
          {...register("password")}
          type="password"
          placeholder="Пароль"
        />
        <button className={styles.loginForm__button} type="submit">
          Войти
        </button>
        {errors && (
          <p className={styles.loginForm__error}>
            {errors.username?.message || errors.password?.message}
          </p>
        )}
        {responseError && (
          <p className={styles.loginForm__error}>
            Неправильный логин или пароль
          </p>
        )}
        <div className={styles.loginForm__info}>
          <Lock size={20} />
          <span>
            Данные нигде не хранятся и не передаются никуда, кроме API Journal.
          </span>
        </div>
      </form>
    </FormProvider>
  );
};
