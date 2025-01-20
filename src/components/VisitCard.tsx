interface IProps {
  text: string;
  sum: number;
  percent?: number;
  color: string;
}

export default function VisitCard({ text, sum, percent, color }: IProps) {
  return (
    <p className={`card ${color}`}>
      {percent ? (
        <>
          <p className="card__small">{sum}</p>
          <p className="card__sum">{percent}%</p>
        </>
      ) : (
        <b className="card__sum">{sum}</b>
      )}
      <p className="card__text">{text}</p>
    </p>
  );
}
