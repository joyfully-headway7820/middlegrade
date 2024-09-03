interface IProps {
  text: string;
  sum: number;
}

export default function TextBlock({ text, sum }: IProps) {
  return (
    <p>
      {text}: <b>{sum}</b>
    </p>
  );
}
