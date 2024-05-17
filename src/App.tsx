import React from "react";
import MiddleGrade from "./components/MiddleGrade/MiddleGrade";
import Visits from "./components/Visits";
import dataJson from "./data.json";

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

export interface IData {
	data: IDataElement[];
}

function changeTheme(): void {
	document.body.classList.toggle("light_theme");
}

function App() {
	const dataArr: IDataElement[] = dataJson;
	const [data, setData] = React.useState<IDataElement[]>(dataArr);
	const [activeSpec, setActiveSpec] = React.useState<string>("Все предметы");
	const [activeList, setActiveList] = React.useState<boolean>(false);
	const date = new Date(data[0]?.date_visit);
	const day: number = date.getDate();
	const month: number = date.getMonth();
	const year: number = date.getFullYear();
	const arrDate: string = month >= 8 ? `${year - 1}-09-01` : `${year}`;
	const arr: string[] = dataJson
		.map((i: IDataElement) => i.spec_name)
		.filter((_, pos) => dataJson[pos].date_visit > arrDate);
	const specList: string[] = arr
		.filter((item: string, pos: number) => arr.indexOf(item) === pos)
		.sort();
	specList.forEach((element) => {
		if (specList.includes(element) && specList.includes(`${element} РПО`)) {
			specList.splice(specList.indexOf(`${element} РПО`), 1);
		}
	});

	const months: string[] = [
		"января",
		"февраля",
		"марта",
		"апреля",
		"мая",
		"июня",
		"июля",
		"августа",
		"сентября",
		"октября",
		"ноября",
		"декабря",
	];

	return (
		<div className='App' onClick={() => setActiveList(false)}>
			<button className='theme-btn' onClick={changeTheme}>
				<svg
					width='48px'
					height='48px'
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
					aria-labelledby='nightModeIconTitle'
					stroke='#eee'
					strokeWidth='1'
					strokeLinecap='square'
					strokeLinejoin='miter'
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
			{dataArr.length ? (
				<>
					<h1>Статистика</h1>
					<div className='flex'>
						<div>
							<div
								className='activeSpec'
								onClick={(event) => {
									event.stopPropagation();
									setActiveList(!activeList);
								}}
							>
								{activeSpec}
							</div>
							{activeList && (
								<ul>
									<li
										onClick={() => {
											setData(dataArr);
											setActiveSpec("Все предметы");
											setActiveList(false);
										}}
									>
										Все предметы
									</li>
									{specList.map((spec) => (
										<li
											key={spec}
											onClick={() => {
												setData(
													dataArr.filter(
														(element) =>
															element.spec_name === spec ||
															element.spec_name === `${spec} РПО`
													)
												);
												setActiveSpec(spec);
												setActiveList(false);
											}}
										>
											{spec}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
					<h2>Средний балл</h2>
					<MiddleGrade data={data} />
					<h2>Посещаемость</h2>
					<Visits data={data} />
					<div className='actuality'>
						Последняя пара была {day} {months[month]} {year} г.
					</div>
				</>
			) : (
				<div className='text_block'>
					Чтобы приложение заработало, нужно сделать следующее:
					<ol>
						<li>Зайти в журнал и нажать F12 </li>
						<li>Найти раздел "Сеть" и зайти в оценки</li>
						<li>
							В консоли ищешь GET-запрос с именем "student-visits", он будет
							снизу, нажимаешь на него
						</li>
						<li>
							Справа откроется содержание запроса, нужно зайти в раздел "Ответ"
							и скопировать оттуда всё содержимое, после чего перенести все
							данные из журнала в файл data.json, который находится в этом
							приложении в папке src/data.json.{" "}
							<b>Открыть файл можно в любом текстовом редакторе</b>, даже в
							блокноте, то есть устанавливать среду разработки не нужно.
						</li>
					</ol>
					<a href='/video.mp4' className='open_video' target='_blank'>
						Открыть видеоинструкцию
					</a>
				</div>
			)}
		</div>
	);
}

export default App;
