const MIN_COMMENT_LENGTH = 20;
const MAX_COMMENT_LENGTH = 500;

export const validateEvaluateComment = (mark: number, comment: string) => {
  const trimmed = comment.trim();

  if (trimmed.length === 0) {
    if (mark <= 3)
      return "При оценке 3 и ниже нужен комментарий от 20 до 500 символов";

    return null;
  }

  if (trimmed.length < MIN_COMMENT_LENGTH || trimmed.length > MAX_COMMENT_LENGTH)
    return "Комментарий должен быть от 20 до 500 символов";

  return null;
};
