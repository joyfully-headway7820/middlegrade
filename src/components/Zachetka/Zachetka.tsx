import { IZachetka } from "../../App";
import "../../css/zachetka.css";

export default function Zachetka({ data }: IZachetka) {
	function toFive(num: number): number {
		switch (num) {
			case 1:
			case 2:
			case 3:
				num = 2;
				break;
			case 4:
			case 5:
			case 6:
				num = 3;
				break;
			case 7:
			case 8:
			case 9:
				num = 4;
				break;
			case 10:
			case 11:
			case 12:
				num = 5;
				break;
			default:
				break;
		}
		return num;
	}

	return (
		<div className='zachetka'>
			{data.map((element) => (
				<div className='zachetka__element'>
					<div className='zachetka__name'>{element.spec}</div>
					<div className='zachetka__grade'>{toFive(element.mark)}</div>
				</div>
			))}
		</div>
	);
}
