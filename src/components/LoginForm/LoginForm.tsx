import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useCookies } from "react-cookie";
import { applicationKey } from "../../constants/constants.ts";
import styles from "./LoginForm.module.scss";

const formLoginSchema = z.object({
  username: z.string().min(4, "Введите свой логин от журнала"),
  password: z.string().min(2, "Введите пароль"),
});

type TFormLogin = z.infer<typeof formLoginSchema>;

interface ILoginResponse {
  access_token: string;
}

export const LoginForm = () => {
  const [cookies, setCookie] = useCookies(["access_token"]);
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
      console.log(data);

      const response = await axios.post<ILoginResponse>(
        "http://localhost:8080/login",
        {
          username: data.username,
          password: data.password,
          application_key: applicationKey,
        },
      );
      if (!response.data.access_token) return;

      const accessToken: string = response.data.access_token;
      console.log(accessToken);

      setCookie("access_token", accessToken);
    } catch (e) {
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
          Введи логин и пароль от Journal, чтобы увидеть свою статистику
        </h2>
        <input
          className={styles.loginForm__input}
          {...register("username")}
          placeholder="Логин"
        />
        <input
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
      </form>
    </FormProvider>
  );
};
