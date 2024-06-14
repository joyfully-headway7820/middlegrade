import React from "react";
import MiddleGrade from "./components/MiddleGrade/MiddleGrade";
import Visits from "./components/Visits";
import SpecList from "./components/SpecList";
import Zachetka from "./components/Zachetka/Zachetka";

import zData from "./zachetka.json";
import dataJson from "./data.json";

export interface IZachetkaElement {
	teacher: string;
	mark: number;
	mark_type: number;
	date: string;
	ex_file_name: string | null;
	id_file: number;
	exam_id: number;
	file_path: string | null;
	comment_teach: string | null;
	need_access: number;
	need_access_stud: number | null;
	comment_delete_file: string | null;
	spec: string;
}

export interface IZachetka {
	data: IZachetkaElement[];
}

export interface IDataElement {
	date_visit: string;
	lesson_number: number;
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

function App() {
	const [activeList, setActiveList] = React.useState<boolean>(false);
	const [openZachetka, setOpenZachetka] = React.useState<boolean>(false);
	const [data, setData] = React.useState<IDataElement[]>(dataJson);
	const date = new Date(data[0]?.date_visit);
	const day: number = date.getDate();
	const month: number = date.getMonth();
	const year: number = date.getFullYear();
	const arrDate: string = month >= 8 ? `${year - 1}-09-01` : `${year}`;

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
		<div className='app' onClick={() => setActiveList(false)}>
			{dataJson.length ? (
				<>
					<h1 className='app__heading'>Статистика</h1>
					<SpecList
						arrDate={arrDate}
						setData={setData}
						activeList={activeList}
						setActiveList={setActiveList}
					/>
					<h2 className='sec__heading'>Средний балл</h2>
					<MiddleGrade data={data} zData={zData} />
					<h2 className='sec__heading'>Посещаемость</h2>
					<Visits data={data} />
					<div className='actuality'>
						Последняя пара была {day} {months[month]} {year} г.
					</div>
				</>
			) : (
				<div className='text_block'>
					Чтобы приложение заработало, нужно сделать следующее:
					<ol className='instruction'>
						<li>Зайти в журнал и нажать F12</li>
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
			{zData.length ? (
				<button
					className='open_video'
					onClick={() => setOpenZachetka(!openZachetka)}
				>
					{openZachetka ? "Закрыть зачётку" : "Открыть зачётку"}
				</button>
			) : (
				""
			)}
			{openZachetka && <Zachetka data={zData} />}
		</div>
	);
}

export default App;
