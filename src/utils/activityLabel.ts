const ACTIVITY_LABELS: Record<string, string> = {
  PAIR_VISIT: "Посещение пары",
  EVALUATION_LESSON_MARK: "Оценка занятия",
  HOMETASK_INTIME: "Своевременное выполнение домашнего задания",
  ASSESMENT: "Оценка",
  AUTO_MARK_EXPIRED_HOMEWORK: "Не выполнение сроков сдачи домашнего задания",
  REDO_HOMETASK: "Пересдача домашнего задания",
  PROFILE_ACHIEVE: "Полностью заполненный профиль",
  MARKET_ORDER: "Покупка в маркете",
  MAP_TASK_APPROVED: "Награда за выполненное задание в maps",
  COMPETITION: "Участие в конкурсе",
  QUIZ_PASSING_EXPIRATION: "Пересдача теста",
  "5_VISITS_WITHOUT_DELAY": "5 посещений подряд без опозданий",
  "5_VISITS_WITHOUT_GAP": "5 посещений подряд без пропусков",
  "10_VISITS_WITHOUT_DELAY": "10 посещений подряд без опозданий",
  "10_VISITS_WITHOUT_GAP": "10 посещений подряд без пропусков",
  "20_VISITS_WITHOUT_DELAY": "20 посещений подряд без опозданий",
  "20_VISITS_WITHOUT_GAP": "20 посещений подряд без пропусков",
  DIAMOND: "Топкоины",
  COIN: "Топгемы",
};

const lookup = (key: string, translations?: Record<string, string>): string => {
  if (!key) {
    return "";
  }

  return translations?.[key] || ACTIVITY_LABELS[key] || key;
};

export const activityLabel = (
  entry: {
    achievements_name: string;
    point_types_name: string;
  },
  translations?: Record<string, string>,
): string =>
  lookup(entry.achievements_name, translations) ||
  lookup(entry.point_types_name, translations) ||
  "Начисление";
