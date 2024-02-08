import MiddleGrade from "./components/MiddleGrade/MiddleGrade.tsx";
import Visits from "./components/Visits.tsx";
import dataJson from "../public/data.json";

export interface IData {
	data: IDataElement[];
}

interface IDataElement {
	date_visit: string;
	lession_number?: number;
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

function App() {
	const data: IDataElement[] = dataJson;

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
