import React from "react";
import styles from "./Footer.module.scss";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        className={styles.footer__link}
        href="https://github.com/ik1domari/middlegrade"
        target="_blank"
      >
        <Github className={styles.footer__link__icon} size={20} />
        Исходный код
      </a>
    </footer>
  );
}
