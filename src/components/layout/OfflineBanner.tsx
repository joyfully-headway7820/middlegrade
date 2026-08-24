import { useOnline } from "@/hooks/useOnline";

export const OfflineBanner = () => {
  const online = useOnline();

  if (online) {
    return null;
  }

  return (
    <p
      role="status"
      className="sticky top-0 z-30 bg-warn/20 px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-center text-sm text-warn"
    >
      Нет сети. Показаны сохранённые данные.
    </p>
  );
};
