import { IData } from "../../App";
import TextBlock from "./TextBlock";

export default function MiddleGrade({ data }: IData) {
	const grades: (number | null)[] = [];
	const classWork: (number | null)[] = [];
	const controlWork: (number | null)[] = [];
	const homeWork: (number | null)[] = [];
	const labs: (number | null)[] = [];
	let gradeSum: number,
		classGrade: number,
		controlGrade: number,
		homeGrade: number,
		labGrade: number;
	gradeSum = classGrade = controlGrade = homeGrade = labGrade = 0;
	data.forEach((_, i) => {
		data[i].class_work_mark && grades.push(data[i].class_work_mark);
		data[i].class_work_mark && classWork.push(data[i].class_work_mark);
		data[i].control_work_mark && grades.push(data[i].control_work_mark);
		data[i].control_work_mark && controlWork.push(data[i].control_work_mark);
		data[i].home_work_mark && grades.push(data[i].home_work_mark);
		data[i].home_work_mark && homeWork.push(data[i].home_work_mark);
		data[i].lab_work_mark && grades.push(data[i].lab_work_mark);
		data[i].lab_work_mark && labs.push(data[i].lab_work_mark);
		gradeSum! += data[i].class_work_mark!;
		classGrade! += data[i].class_work_mark!;
		gradeSum! += data[i].control_work_mark!;
		controlGrade! += data[i].control_work_mark!;
		gradeSum! += data[i].home_work_mark!;
		homeGrade! += data[i].home_work_mark!;
		gradeSum! += data[i].lab_work_mark!;
		labGrade! += data[i].lab_work_mark!;
	});

	function countMiddle(grade: number, arr: (number | null)[]): number {
		if (grade) {
			return +(grade / arr.length).toFixed(4);
		}
		return 0;
	}
	// Перевод в пятибальную систему
	function toFive(arr: (number | null)[]): (number | null)[] {
		for (let i = 0; i < arr.length; i++) {
			switch (arr[i]) {
				case 1:
				case 2:
				case 3:
					arr[i] = 2;
					break;
				case 4:
				case 5:
				case 6:
					arr[i] = 3;
					break;
				case 7:
				case 8:
				case 9:
					arr[i] = 4;
					break;
				case 10:
				case 11:
				case 12:
					arr[i] = 5;
					break;
				default:
					break;
			}
		}
		return arr;
	}
	function sumGradeArr(arr: (number | null)[], grade = 0): number {
		toFive(arr).forEach((i: number | null) => {
			grade += i!;
		});
		return countMiddle(grade, arr);
	}

	return (
		<div className='inner_text'>
			<TextBlock
				text='Средний балл'
				sum={countMiddle(gradeSum, grades)}
				sum5={sumGradeArr(grades)}
			/>
			<TextBlock
				text='Средний балл за работу на паре'
				sum={countMiddle(classGrade, classWork)}
				sum5={sumGradeArr(classWork)}
			/>
			<TextBlock
				text='Средний балл за контрольные'
				sum={countMiddle(controlGrade, controlWork)}
				sum5={sumGradeArr(controlWork)}
			/>
			<TextBlock
				text='Средний балл за домашки'
				sum={countMiddle(homeGrade, homeWork)}
				sum5={sumGradeArr(homeWork)}
			/>
			<TextBlock
				text='Средний балл за лабы'
				sum={countMiddle(labGrade, labs)}
				sum5={sumGradeArr(labs)}
			/>
		</div>
	);
}
