import React from "react";
import SpecList from "../SpecList";
import MiddleGrade from "../MiddleGrade";
import Visits from "../Visits";
import { ChevronDown } from "lucide-react";
import Marks from "../Marks";
import Exams from "../Exams";
import { COOKIE_EXPIRY_DATE } from "../../constants/constants.ts";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { marksQuery } from "../../queries/marksQuery.ts";
import { examsQuery } from "../../queries/examsQuery.ts";
import authStore from "../../store/authStore.ts";
import { authQuery } from "../../queries/authQuery.ts";

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
  spec: string;
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

type Props = {
  activeList: boolean;
  setActiveList: (activeList: boolean) => void;
};

export const Stats = ({ activeList, setActiveList }: Props) => {
  const [cookies, setCookies, removeCookie] = useCookies();
  const [openExams, setOpenExams] = React.useState(false);
  const [openMarks, setOpenMarks] = React.useState(false);
  const [data, setData] = React.useState<IDataElement[]>([]);
  const { setIsLoggedIn } = authStore();
  const queryClient = useQueryClient();

  const marks = useQuery<IDataElement[]>({
    queryKey: ["marks"],
    queryFn: async () => await marksQuery(cookies.access_token),
  });

  const exams = useQuery<IExamsElement[]>({
    queryKey: ["exams"],
    queryFn: async () => await examsQuery(cookies.access_token),
  });

  const firstMarkDate = marks.data?.[0]?.date_visit;
  const date = firstMarkDate ? new Date(firstMarkDate) : new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const arrDate = month >= 8 ? `${year}-09-01` : `${year - 1}-09-01`;

  React.useEffect(() => {
    const handleError = async () => {
      try {
        removeCookie("access_token");
        const token = await authQuery(cookies.username, cookies.password);

        setCookies("access_token", token, {
          sameSite: "lax",
          secure: true,
          expires: COOKIE_EXPIRY_DATE,
        });

        await queryClient.invalidateQueries({ queryKey: ["marks", "exams"] });
      } catch (error) {
        setIsLoggedIn(false);
        console.error("Auth failed:", error);
      }
    };

    if (marks.error || exams.error) {
      handleError();
    }
  }, [marks.error, exams.error]);

  React.useEffect(() => {
    if (marks.data) {
      setData(marks.data);
    }
  }, [marks.data]);

  return (
    <div>
      {marks.isLoading || exams.isLoading ? (
        <div className="app__loader">Загрузка...</div>
      ) : (
        <>
          <SpecList
            exams={exams.data || []}
            initialMarks={marks.data || []}
            arrDate={arrDate}
            setData={setData}
            activeList={activeList}
            setActiveList={setActiveList}
          />
          <h2 className="app__subheading">Средний балл</h2>
          <MiddleGrade data={data} exams={exams.data || []} />
          <h2 className="app__subheading">Посещаемость</h2>
          <Visits data={data} />

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
          {exams.data?.length && (
            <button
              className="app__button"
              onClick={() => setOpenExams(!openExams)}
            >
              {openExams ? "Закрыть зачётку" : "Открыть зачётку"}
            </button>
          )}
          {openExams && <Exams data={exams.data || []} />}
        </>
      )}
    </div>
  );
};
