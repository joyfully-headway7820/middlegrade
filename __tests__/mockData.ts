import { IDataElement, IExamsElement } from "../src/components/Stats";

export const examsMockData: IExamsElement[] = [
  {
    teacher: "Эллиот Алдерсон",
    mark: 5,
    mark_type: 1,
    date: "2025-02-25",
    ex_file_name: null,
    id_file: 0,
    exam_id: 898,
    file_path: null,
    comment_teach: null,
    need_access: 0,
    need_access_stud: null,
    comment_delete_file: null,
    spec: "Программирование на JavaScript",
  },
  {
    teacher: "Роман Романов",
    mark: 5,
    mark_type: 1,
    date: "2025-01-27",
    ex_file_name: null,
    id_file: 0,
    exam_id: 770,
    file_path: null,
    comment_teach: null,
    need_access: 0,
    need_access_stud: null,
    comment_delete_file: null,
    spec: "Frontend-разработка",
  },
  {
    teacher: "Дмитриев Дмитрий Дмитриевич",
    mark: 5,
    mark_type: 1,
    date: "2024-12-23",
    ex_file_name: null,
    id_file: 0,
    exam_id: 681,
    file_path: null,
    comment_teach: null,
    need_access: 0,
    need_access_stud: null,
    comment_delete_file: null,
    spec: "Кибербезопасность",
  },
  {
    teacher: "Андреев Андрей Андреевич",
    mark: 5,
    mark_type: 1,
    date: "2024-12-16",
    ex_file_name: null,
    id_file: 0,
    exam_id: 628,
    file_path: null,
    comment_teach: null,
    need_access: 0,
    need_access_stud: null,
    comment_delete_file: null,
    spec: "Математика",
  },
];

export const marksMockData: IDataElement[] = [
  {
    date_visit: "2025-01-17",
    lesson_number: 4,
    status_was: 1,
    spec_id: 16,
    teacher_name: "Андреев Андрей Андреевич",
    spec_name: "Программирование на JavaScript",
    lesson_theme: "JavaScript в браузере",
    control_work_mark: 5,
    home_work_mark: 3,
    lab_work_mark: 1,
    class_work_mark: 5,
  },
  {
    date_visit: "2025-01-17",
    lesson_number: 5,
    status_was: 2,
    spec_id: 54,
    teacher_name: "Степанов Степан Степанович",
    spec_name: "Frontend-разработка",
    lesson_theme: "Event Loop",
    control_work_mark: null,
    home_work_mark: 4,
    lab_work_mark: null,
    class_work_mark: 3,
  },
  {
    date_visit: "2025-01-16",
    lesson_number: 6,
    status_was: 0,
    spec_id: 61,
    teacher_name: "Андреев Андрей Андреевич",
    spec_name: "Разработка на C#",
    lesson_theme: "Использование стандартных интерфейсов",
    control_work_mark: null,
    home_work_mark: 5,
    lab_work_mark: 2,
    class_work_mark: null,
  },
  {
    date_visit: "2023-01-16",
    lesson_number: 6,
    status_was: 1,
    spec_id: 61,
    teacher_name: "Андреев Андрей Андреевич",
    spec_name: "Разработка на C#",
    lesson_theme: "Использование стандартных интерфейсов",
    control_work_mark: 10,
    home_work_mark: 11,
    lab_work_mark: 7,
    class_work_mark: null,
  },
  {
    date_visit: "2023-01-16",
    lesson_number: 6,
    status_was: 2,
    spec_id: 61,
    teacher_name: "Андреев Андрей Андреевич",
    spec_name: "Разработка на C#",
    lesson_theme: "Использование стандартных интерфейсов",
    control_work_mark: null,
    home_work_mark: 12,
    lab_work_mark: 12,
    class_work_mark: null,
  },
];

function generateMarks(count: number) {
  const marks: IDataElement[] = [];

  for (let i = 0; i < count; i++) {
    marks.push({
      date_visit: "2023-01-16",
      lesson_number: 6,
      status_was: 2,
      spec_id: 61,
      teacher_name: "Андреев Андрей Андреевич",
      spec_name: `Разработка на C# ${i}`,
      lesson_theme: "Использование стандартных интерфейсов",
      control_work_mark: null,
      home_work_mark: 12,
      lab_work_mark: 12,
      class_work_mark: null,
    });
  }

  return marks;
}

export const marks_1000 = generateMarks(1000);
export const marks_2000 = generateMarks(2000);
export const marks_10000 = generateMarks(10000);
