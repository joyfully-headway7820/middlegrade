import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useCookies } from "react-cookie";
import { applicationKey } from "../../constants/constants.ts";
import "./login-form.scss";

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
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="login-form__input"
          {...register("username")}
          placeholder="Логин"
        />
        <input
          className="login-form__input login-form__input--password"
          {...register("password")}
          type="password"
          placeholder="Пароль"
        />
        <button className="login-form__button" type="submit">
          Войти
        </button>
        {errors && (
          <p className="login-form__error">{errors.username?.message}</p>
        )}
      </form>
    </FormProvider>
  );
};
