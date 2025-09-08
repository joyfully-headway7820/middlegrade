import styles from "./Card.module.scss";

interface IProps {
  text: string;
  sum: number;
  percent?: number;
  color: string;
}

export default function Card({ text, sum, percent, color }: IProps) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      {percent ? (
        <>
          <p className={styles.card__smalltext}>{sum}</p>
          <p className={styles.card__sum}>{percent}%</p>
        </>
      ) : (
        <b className={styles.card__sum}>{sum}</b>
      )}
      <p className={styles.card__text}>{text}</p>
    </div>
  );
}
