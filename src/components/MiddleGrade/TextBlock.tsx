interface IProps {
  text: string;
  sum: number;
  color: string;
}

export default function TextBlock({ text, sum, color }: IProps) {
  return (
    <p className={`card ${color}`}>
      <b className="card__sum">{sum}</b>
      <p className="card__text">{text}</p>
    </p>
  );
}
