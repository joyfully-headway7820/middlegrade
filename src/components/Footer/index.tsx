import React from "react";
import styles from "./Footer.module.scss";
import { Github, Info } from "lucide-react";
import authorModalStore from "../../store/authorModal.ts";

export default function Footer() {
  const { toggleOpen } = authorModalStore();
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
      <button onClick={toggleOpen} className={styles.footer__link}>
        <Info className={styles.footer__link__icon} size={20} />О проекте
      </button>
    </footer>
  );
}
