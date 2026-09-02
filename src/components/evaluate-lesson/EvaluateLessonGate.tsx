import { Button } from "@/components/ui/Controls";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/evaluate-lesson/StarRating";
import { formatDate } from "@/lib/format";
import type { EvaluateLessonGateState } from "@/hooks/useEvaluateLessonGate";
import { cn } from "@/lib/cn";

type EvaluateLessonGateProps = {
  gate: EvaluateLessonGateState;
};

const commentRequired = (mark: number | null) =>
  mark !== null && mark <= 3;

const CommentField = ({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required: boolean;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-heading">
      {label}
      {required ? null : (
        <span className="font-normal text-ink-500"> (необязательно)</span>
      )}
    </span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={3}
      className={cn(
        "w-full resize-none rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-heading",
        "focus:border-brand-400 focus:outline-none",
      )}
      placeholder="Расскажите, что можно улучшить"
    />
  </label>
);

const canAdvanceTeach = (mark: number | null, comment: string) => {
  if (mark === null) {
    return false;
  }

  if (mark <= 3) {
    return comment.trim().length > 0;
  }

  return true;
};

const canSubmitLesson = (mark: number | null, comment: string) => {
  if (mark === null) {
    return false;
  }

  if (mark <= 3) {
    return comment.trim().length > 0;
  }

  return true;
};

export const EvaluateLessonGate = ({ gate }: EvaluateLessonGateProps) => {
  const { current, stage } = gate;

  if (!current) {
    return null;
  }

  const dateLabel = formatDate(current.date_visit);
  const teachReady = canAdvanceTeach(gate.markTeach, gate.commentTeach);
  const lessonReady = canSubmitLesson(gate.markLesson, gate.commentLesson);

  return (
    <Modal
      title="Оценка занятия"
      description={
        gate.queueLength > 1
          ? `Осталось пар: ${gate.queueLength}`
          : "Пожалуйста, оцените прошедшее занятие"
      }
      onClose={gate.dismiss}
    >
      <div className="flex flex-col gap-5">
        {stage === "teach" ? (
          <>
            <div className="flex items-center gap-3">
              <Avatar
                name={current.fio_teach}
                src={current.teach_photo}
                className="size-14 text-base"
              />
              <div className="min-w-0">
                <p className="font-semibold text-heading">{current.fio_teach}</p>
                <p className="text-sm text-ink-400">{current.spec_name}</p>
                <p className="text-xs text-ink-500">{dateLabel}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-heading">
                Оцените преподавателя
              </p>
              <StarRating
                label="Оценка преподавателя"
                value={gate.markTeach}
                onChange={gate.setMarkTeach}
              />
            </div>

            <CommentField
              label="Комментарий к оценке преподавателя"
              value={gate.commentTeach}
              onChange={gate.setCommentTeach}
              required={commentRequired(gate.markTeach)}
            />
          </>
        ) : (
          <>
            <div>
              <p className="font-semibold text-heading">{current.spec_name}</p>
              <p className="text-sm text-ink-400">{dateLabel}</p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-heading">
                Оцените занятие
              </p>
              <StarRating
                label="Оценка занятия"
                value={gate.markLesson}
                onChange={gate.setMarkLesson}
              />
            </div>

            <CommentField
              label="Комментарий к оценке занятия"
              value={gate.commentLesson}
              onChange={gate.setCommentLesson}
              required={commentRequired(gate.markLesson)}
            />
          </>
        )}

        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <div className="flex flex-wrap gap-2">
            {stage === "lesson" ? (
              <Button type="button" variant="ghost" onClick={gate.goBack}>
                Назад
              </Button>
            ) : null}

            {stage === "teach" ? (
              <Button
                type="button"
                disabled={!teachReady || gate.isSubmitting}
                onClick={gate.goNext}
              >
                Далее
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!lessonReady || gate.isSubmitting}
                onClick={gate.submitCurrent}
              >
                Отправить
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-line bg-overlay/40 p-4">
            <p className="mb-3 text-sm text-ink-300">
              Кнопка ниже отправит 5 звёзд на все оставшиеся пары, включая
              текущую.
            </p>
            <Button
              type="button"
              className="w-full py-3 text-base"
              disabled={gate.isSubmitting}
              onClick={() => void gate.closeAllFive()}
            >
              Всё понравилось, закрыть
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
