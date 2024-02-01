interface IProps {
	text: string;
	sum: number;
	sum5: number;
}

export default function TextBlock({ text, sum, sum5 }: IProps) {
	return (
		<p>
			{text}:{" "}
			<b>
				{sum} ({sum5})
			</b>
		</p>
	);
}
