import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useCookies } from "react-cookie";
import styles from "./LoginForm.module.scss";
import { Input } from "../Input/Input.tsx";

const formLoginSchema = z.object({
  username: z.string().min(4, "Введите свой логин от журнала"),
  password: z.string().min(2, "Введите пароль"),
});

type TFormLogin = z.infer<typeof formLoginSchema>;

interface ILoginResponse {
  access_token: string;
}

export const LoginForm = () => {
  const [cookies, setCookie] = useCookies();
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
      setCookie("username", data.username.trim());
      setCookie("password", data.password.trim());

      const response = await axios.post<ILoginResponse>(
        "http://localhost:3000/auth",
        {
          username: data.username.trim(),
          password: data.password.trim(),
        },
      );
      if (!response.data) return;

      const accessToken = response.data;

      setCookie("access_token", accessToken);
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
      </form>
    </FormProvider>
  );
};
