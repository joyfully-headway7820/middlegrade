import type { QueryClient } from "@tanstack/react-query";
import { persistQueryCache } from "./persistQueryCache";

const DELAY = 800;

export const subscribeQueryPersistence = (client: QueryClient) => {
  let timer = 0;

  const flush = () => {
    window.clearTimeout(timer);
    void persistQueryCache(client);
  };

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(flush, DELAY);
  };

  const unsubscribe = client.getQueryCache().subscribe(schedule);
  window.addEventListener("pagehide", flush);

  return () => {
    window.removeEventListener("pagehide", flush);
    unsubscribe();
  };
};
