import { useState, useEffect } from "react";
import axios from "axios";
import MiddleGrade from "./MiddleGrade.tsx";
import Visits from "./Visits.tsx";

export interface IData {
	data: [
		{
			date_visit: string;
			lession_number: number;
			status_was: number;
			spec_id: number;
			teacher_name: string;
			spec_name: string;
			lesson_theme: string;
			control_work_mark: number | null;
			home_work_mark: number | null;
			lab_work_mark: number | null;
			class_work_mark: number | null;
		}
	];
}

function App() {
	const [data, setData] = useState<IData[]>([]);
	useEffect(() => {
		(async (): Promise<void> => {
			try {
				const { data } = await axios.get("/data.json");
				setData(data);
			} catch (error) {
				console.warn("Файл data.json отсутствует или произошла ошибка");
			}
		})();
	}, []);
	return (
		<div className='App'>
			{data.length ? (
				<>
					<h1>Статистика</h1>
					<h2>Средний балл</h2>
					<MiddleGrade data={data} />
					<h2>Посещаемость</h2>
					<Visits data={data} />
					<div className='actuality'>Актуальность: {data[0].date_visit}</div>
				</>
			) : (
				<div className='text_block'>
					Чтобы приложение заработало, нужно сделать следующее:
					<ol>
						<li>Зайти в журнал и нажать F12 </li>
						<li>Найти раздел "Сеть" и зайти в оценки</li>
						<li>
							В консоли ищешь запрос с именем "student-visits", он будет снизу,
							нажимаешь на него
						</li>
						<li>
							Справа откроется содержание запроса, нужно зайти в раздел "Ответ"
							и скопировать оттуда всё содержимое, после чего перенести все
							данные из журнала в файл data.json, который находится в этом
							приложении в папке public/data.json. Если такого файла нет -
							создай.
						</li>
					</ol>
				</div>
			)}
		</div>
	);
}

export default App;
