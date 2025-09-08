import styles from "./UpButton.module.scss";
import React from "react";
import { ArrowUp } from "lucide-react";

export default function UpButton() {
  return (
    <button className={styles.button} onClick={() => window.scrollTo(0, 0)}>
      <ArrowUp className={styles.button__icon} />
    </button>
  );
}
