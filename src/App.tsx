import React from "react";
import MiddleGrade from "./components/MiddleGrade/MiddleGrade";
import Visits from "./components/Visits/Visits.tsx";
import SpecList from "./components/SpecList/SpecList.tsx";
import Exams from "./components/Exams/Exams.tsx";

import exams from "./exams.json";
import { useCookies } from "react-cookie";
import { LoginForm } from "./components/LoginForm/LoginForm.tsx";
import Footer from "./components/Footer/Footer.tsx";

export interface IExamsElement {
  teacher: string | null;
  mark: number | null;
  mark_type: number | null;
  date: string | null;
  ex_file_name: string | null;
  id_file: number | null;
  exam_id: number | null;
  file_path: string | null;
  comment_teach: string | null;
  need_access: number;
  need_access_stud: number | null;
  comment_delete_file: string | null;
  spec: string | null;
}

export interface IExams {
  data: IExamsElement[];
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
  const [cookies] = useCookies(["access_token"]);
  const [activeList, setActiveList] = React.useState<boolean>(false);
  const [openExams, setOpenExams] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IDataElement[]>([]);
  const date = new Date(data[0]?.date_visit);
  const month: number = date.getMonth();
  const year: number = date.getFullYear();
  const arrDate: string = month >= 8 ? `${year}-09-01` : `${year - 1}-09-01`;

  return (
    <div className="app" onClick={() => setActiveList(false)}>
      {!cookies.access_token ? (
        <>
          <h1 className="app__heading">Статистика</h1>
          <SpecList
            arrDate={arrDate}
            setData={setData}
            activeList={activeList}
            setActiveList={setActiveList}
          />
          <h2 className="app__subheading">Средний балл</h2>
          <MiddleGrade data={data} exams={exams} />
          <h2 className="app__subheading">Посещаемость</h2>
          <Visits data={data} />
        </>
      ) : (
        <LoginForm />
      )}
      {exams.length ? (
        <button className="open_video" onClick={() => setOpenExams(!openExams)}>
          {openExams ? "Закрыть зачётку" : "Открыть зачётку"}
        </button>
      ) : (
        ""
      )}
      {openExams && <Exams data={exams} />}
      <Footer />
    </div>
  );
}

export default App;
