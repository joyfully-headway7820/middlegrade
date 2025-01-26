"use client";
import { Eye, X } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import styles from "./Input.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
}

export const Input: React.FC<Props> = ({
  name,
  type,
  label,
  required,
  placeholder,
  ...props
}) => {
  const { register, watch, setValue } = useFormContext();

  const value = watch(name);

  const [showPassword, setShowPassword] = React.useState(false);
  const onShowPassword = () => setShowPassword((prev) => !prev);

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div className={styles.input}>
      {label && (
        <p className={styles.input__label}>
          {label}{" "}
          {required && <span className={styles.input__required}>*</span>}
        </p>
      )}

      <div className={styles.input__field}>
        <input
          className={styles.byyyy}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          {...props}
          {...register(name)}
        />
        <div className={styles.input__field__buttons}>
          {value && type === "password" && (
            <button
              onClick={onShowPassword}
              type="button"
              className={styles.input__field__showpassword}
            >
              <Eye size={20} />
            </button>
          )}
          {value && (
            <button
              onClick={onClickClear}
              type="button"
              className={styles.input__field__clear}
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
