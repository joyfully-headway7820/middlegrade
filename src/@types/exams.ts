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
