import { MessageSquareMore } from "lucide-react";

export const FeedBackButton = () => {
  return (
    <a
      href="https://github.com/joyfully-headway7820/middlegrade/issues/new"
      target="_blank"
      className="fixed bottom-5 right-5 rounded-full bg-brand-600 text-white w-12.5 h-12.5 flex items-center justify-center shadow-md font-bold transition-all hover:bg-brand-500 hover:shadow-lg group hover:w-70"
    >
      <MessageSquareMore size={25} />
      <span className="hidden ml-3 group-hover:inline text-nowrap font-medium">
        Оставьте обратную связь
      </span>
    </a>
  );
};
