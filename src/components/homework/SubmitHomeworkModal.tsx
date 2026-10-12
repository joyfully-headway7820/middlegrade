import { useEffect, useRef, useState } from "react";
import { HomeworkDropOverlay } from "@/components/homework/HomeworkDropOverlay";
import { Button } from "@/components/ui/Controls";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api";
import { createHomeworkSubmission } from "@/lib/createHomeworkSubmission";
import { readHomeworkFileDrop } from "@/utils/readHomeworkFileDrop";
import { validateHomeworkSubmission } from "@/utils/validateHomeworkSubmission";

type SubmitHomeworkModalProps = {
  homeworkId: number;
  theme: string;
  onClose: () => void;
  onSuccess: () => void;
};

export const SubmitHomeworkModal = ({
  homeworkId,
  theme,
  onClose,
  onSuccess,
}: SubmitHomeworkModalProps) => {
  const [answerText, setAnswerText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFileDrag, setIsFileDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  isSubmittingRef.current = isSubmitting;

  useEffect(() => {
    let shown = false;

    const hasFiles = ({ dataTransfer }: DragEvent) =>
      Array.from(dataTransfer?.types ?? []).includes("Files");

    const showOverlay = () => {
      if (shown)
        return;
      shown = true;
      setIsFileDrag(true);
    };

    const hideOverlay = () => {
      shown = false;
      setIsFileDrag(false);
    };

    const onDragEnter = (event: DragEvent) => {
      if (!hasFiles(event))
        return;
      showOverlay();
    };

    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
      if (!hasFiles(event) || !event.dataTransfer)
        return;
      event.dataTransfer.dropEffect = "copy";
      showOverlay();
    };

    const onDragLeave = (event: DragEvent) => {
      if (event.relatedTarget instanceof Node)
        return;
      hideOverlay();
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      hideOverlay();
      if (!event.dataTransfer || isSubmittingRef.current)
        return;

      const dropped = readHomeworkFileDrop(event.dataTransfer);
      if (dropped.isDirectory) {
        setError("Папку нельзя прикрепить");
        return;
      }
      if (!dropped.file)
        return;

      setFile(dropped.file);
      setError(null);
      if (!fileInputRef.current)
        return;
      const transfer = new DataTransfer();
      transfer.items.add(dropped.file);
      fileInputRef.current.files = transfer.files;
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragend", hideOverlay);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragend", hideOverlay);
    };
  }, []);

  const submit = async () => {
    const validationError = validateHomeworkSubmission({ answerText, file });

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createHomeworkSubmission({
        homeworkId,
        answerText,
        file: file ?? undefined,
      });
      onSuccess();
      onClose();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Не удалось отправить работу",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        title="Загрузить работу"
        description={theme || undefined}
        onClose={() => {
          if (!isSubmitting)
            onClose();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="homework-answer" className="text-sm font-medium text-ink-300">
              Текст ответа
            </label>
            <textarea
              id="homework-answer"
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              rows={5}
              maxLength={500}
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-500 focus:border-brand-400 focus:outline-none"
              placeholder="Ссылка или комментарий к работе"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="homework-file" className="text-sm font-medium text-ink-300">
              Файл
            </label>
            <input
              ref={fileInputRef}
              id="homework-file"
              type="file"
              onChange={({ target }) => {
                const next = target.files?.[0] ?? null;
                setFile(next);
                if (next)
                  setError(null);
              }}
              className="text-sm text-ink-300 file:mr-3 file:rounded-lg file:border-0 file:bg-overlay file:px-3 file:py-2 file:text-sm file:text-ink-100"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-bad">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button type="button" onClick={() => void submit()} disabled={isSubmitting}>
              Отправить
            </Button>
          </div>
        </div>
      </Modal>
      {isFileDrag ? <HomeworkDropOverlay /> : null}
    </>
  );
};
