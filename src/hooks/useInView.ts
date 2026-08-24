import { useEffect, useState } from "react";

export const useInView = (enabled: boolean) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled || !node) {
      setInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, node]);

  return { ref: setNode, inView };
};
