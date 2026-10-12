import { createPortal } from "react-dom";

export const HomeworkDropOverlay = () =>
  createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-scrim p-8">
      <div className="flex h-full max-h-[28rem] w-full max-w-3xl items-center justify-center rounded-2xl border-2 border-dashed border-line">
        <p className="text-2xl font-medium text-heading">Перетащите файлы сюда</p>
      </div>
    </div>,
    document.body,
  );
