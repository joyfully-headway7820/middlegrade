import React from "react";
import authorModalStore from "../../store/authorModal.ts";
import styles from "./AboutModal.module.scss";
import { X } from "lucide-react";

export default function AboutModal() {
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
        <h3 className={styles.modal__content__title}>О проекте</h3>
        <article className={styles.modal__content__text}>
          <p>
            Middlegrade - это проект с открытым исходным кодом для студентов IT
            Top College, предназначенный для того, чтобы получить статистику о
            своём среднем балле и посещаемости.
          </p>
          <p>
            Проект Middlegrade изначально был сделан для личного использования,
            после чего стал моим курсовым проектом, над которым я работаю до сих
            пор.
          </p>
          <p>
            Связаться со мной можно в{" "}
            <a href="https://t.me/psychomorphism" target="_blank">
              Telegram.
            </a>
          </p>
          <p>Поддержать проект можно по <a href="https://pay.cloudtips.ru/p/8fc421a5">этой ссылке.</a></p>
          <p>Рад стараться.</p>
          <p>❤️</p>
        </article>
      </div>
    </div>
  );
}
