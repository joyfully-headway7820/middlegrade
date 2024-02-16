import MiddleGrade from "./components/MiddleGrade/MiddleGrade.tsx";
import Visits from "./components/Visits.tsx";
import dataJson from "./data.json";

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

function changeTheme(): void {
	document.body.classList.toggle("light_theme");
}

function App() {
	const data: IDataElement[] = dataJson;

	return (
		<div className='App'>
			<button className='theme-btn' onClick={changeTheme}>
				<svg
					width='48px'
					height='48px'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
					aria-labelledby='nightModeIconTitle'
					stroke='#eee'
					stroke-width='1'
					stroke-linecap='square'
					stroke-linejoin='miter'
					fill='none'
					color='#eee'
				>
					{" "}
					<path d='M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14z' />{" "}
					<path d='M15.899 12.899a4 4 0 0 1-4.797-4.797A4.002 4.002 0 0 0 12 16c1.9 0 3.49-1.325 3.899-3.101z' />{" "}
					<path d='M12 5V3M12 21v-2' />{" "}
					<path d='M5 12H2h3zM22 12h-3 3zM16.95 7.05L19.07 4.93 16.95 7.05zM4.929 19.071L7.05 16.95 4.93 19.07zM16.95 16.95l2.121 2.121-2.121-2.121zM4.929 4.929L7.05 7.05 4.93 4.93z' />{" "}
				</svg>
			</button>
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
