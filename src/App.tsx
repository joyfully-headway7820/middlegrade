import React from "react";
import MiddleGrade from "./components/MiddleGrade/MiddleGrade";
import Visits from "./components/Visits/Visits.tsx";
import SpecList from "./components/SpecList/SpecList.tsx";
import Exams from "./components/Exams/Exams.tsx";
import { useCookies } from "react-cookie";
import { LoginForm } from "./components/LoginForm/LoginForm.tsx";
import Footer from "./components/Footer/Footer.tsx";
import authorModalStore from "./store/authorModal.ts";
import AboutModal from "./components/AboutModal/AboutModal.tsx";
import axios from "axios";
import Logout from "./components/Logout/Logout.tsx";
import { serverAlias } from "./constants/constants.ts";
import Marks from "./components/Marks/Marks.tsx";
import { ChevronDown } from "lucide-react";
import UpButton from "./components/UpButton/UpButton.tsx";

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
  const [cookies, setCookies, removeCookie] = useCookies();
  const [activeList, setActiveList] = React.useState<boolean>(false);
  const [openExams, setOpenExams] = React.useState<boolean>(false);
  const [openMarks, setOpenMarks] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IDataElement[]>([]);
  const [initialMarks, setInitialMarks] = React.useState<IDataElement[]>([]);

  const date = new Date(data[0]?.date_visit);
  const month: number = date.getMonth();
  const year: number = date.getFullYear();
  const arrDate: string = month >= 8 ? `${year}-09-01` : `${year - 1}-09-01`;
  const { isOpen } = authorModalStore();

  const [exams, setExams] = React.useState<IExamsElement[]>([]);

  React.useEffect(() => {
    (async () => {
      if (cookies.access_token) {
        try {
          const marks = await axios.post(`${serverAlias}/marks/`, {
            token: cookies.access_token,
          });
          const exams = await axios.post(`${serverAlias}/exams/`, {
            token: cookies.access_token,
          });
          setData(marks.data);
          setInitialMarks(marks.data);
          setExams(exams.data);
        } catch (error) {
          try {
            removeCookie("access_token");
            const token = await axios.post(`${serverAlias}/auth/`);
            setCookies("access_token", token.data);
          } catch (error) {
            console.error(error);
            removeCookie("access_token");
          }
        }
      }
    })();
  }, [cookies.access_token]);

  return (
    <div className="app" onClick={() => setActiveList(false)}>
      {isOpen && <AboutModal />}
      {cookies.access_token ? (
        <>
          <h1 className="app__heading">
            Статистика
            <Logout />
          </h1>
          <SpecList
            initialMarks={initialMarks}
            arrDate={arrDate}
            setData={setData}
            activeList={activeList}
            setActiveList={setActiveList}
          />
          <h2 className="app__subheading">Средний балл</h2>
          <MiddleGrade data={data} exams={exams} />
          <h2 className="app__subheading">Посещаемость</h2>
          <Visits data={data} />
          {exams.length > 0 && (
            <button
              className="app__button"
              onClick={() => setOpenExams(!openExams)}
            >
              {openExams ? "Закрыть зачётку" : "Открыть зачётку"}
            </button>
          )}
          {openExams && <Exams data={exams} />}
          <div className="app__marks" onClick={() => setOpenMarks(!openMarks)}>
            <h2 className="app__subheading">Оценки</h2>
            <ChevronDown
              className={
                openMarks
                  ? "app__marks__button app__marks__button__active"
                  : "app__marks__button"
              }
              size={25}
            />
          </div>
          {openMarks && <Marks marks={data} />}
        </>
      ) : (
        <div className="app__login">
          <LoginForm />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
