import { QueryClient } from "@tanstack/react-query";

const WEEK = 1000 * 60 * 60 * 24 * 7;
const FIVE_MINUTES = 1000 * 60 * 5;

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: FIVE_MINUTES,
        gcTime: WEEK,
        networkMode: "offlineFirst",
        retry: (count) =>
          typeof navigator !== "undefined" && navigator.onLine && count < 1,
      },
      mutations: {
        networkMode: "offlineFirst",
        retry: false,
      },
    },
  });
