import React from "react";
import authorModalStore from "../../store/authorModal.ts";
import styles from "./AuthorModal.module.scss";
import { X } from "lucide-react";

export default function AuthorModal() {
  const { toggleOpen } = authorModalStore();
  const [closing, setClosing] = React.useState<boolean>(false);
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      toggleOpen();
    }, 200);
  };
  return (
    <div className={styles.modal} onClick={closeModal}>
      <div
        className={`${styles.modal__content} ${closing && styles.closing}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modal__content__close} onClick={closeModal}>
          <X size={30} />
        </button>
        <h3 className={styles.modal__content__title}>Авторство</h3>
        <p className={styles.modal__content__text}>
          Тут будет расписано авторство этого и серверного приложения
        </p>
      </div>
    </div>
  );
}
