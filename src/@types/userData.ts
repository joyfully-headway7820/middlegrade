type Groups = {
  group_status: number;
  is_primary: boolean;
  id: number;
  name: string;
};

type GamingPoints = {
  new_gaming_point_types_id: number;
  points: number;
};

type Visibility = {
  is_design: boolean;
  is_video_courses: boolean;
  is_vacancy: boolean;
  is_signal: boolean;
  is_promo: boolean;
  is_test: boolean;
  is_email_verified: boolean;
  is_quizzes_expired: boolean;
  is_debtor: boolean;
  is_phone_verified: boolean;
  is_only_profile: boolean;
  is_referral_program: boolean;
  is_dz_group_issue: boolean;
  is_birthday: boolean;
  is_school: boolean;
  is_news_popup: boolean;
  is_school_branch: boolean;
  is_college_branch: boolean;
  is_higher_education_branch: boolean;
  is_russian_branch: boolean;
};

export type UserData = {
  groups: Groups[];
  manual_link?: string;
  student_id: number;
  current_group_id: number;
  full_name: string;
  achives_count: number;
  stream_id: number;
  stream_name: string;
  group_name: string;
  level?: number;
  photo?: string;
  gaming_points: GamingPoints[];
  spent_gaming_points: GamingPoints[];
  visibility: Visibility;
  current_group_status: number;
  birthday: string;
  last_date_visit: string;
  registration_date: string;
  gender: number;
  study_form_short_name: string;
};
