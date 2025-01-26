import React from "react";
import styles from "./Footer.module.scss";
import { Github, UsersRound } from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        className={styles.footer__link}
        href="https://github.com/mikrocosmos/middlegrade"
        target="_blank"
      >
        <Github className={styles.footer__link__icon} size={20} />
        Исходный код
      </a>
      <div className={styles.footer__separator} />
      <button className={styles.footer__link}>
        <UsersRound className={styles.footer__link__icon} size={20} />
        Авторство
      </button>
    </footer>
  );
}
