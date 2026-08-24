import { dehydrate, type QueryClient } from "@tanstack/react-query";
import { idbSet } from "./idb";
import { QUERY_CACHE_KEY } from "./queryCacheKey";
import { shouldDehydrateQuery } from "@/utils/shouldDehydrateQuery";

export const persistQueryCache = async (client: QueryClient) => {
  try {
    const state = dehydrate(client, {
      shouldDehydrateQuery: (query) =>
        shouldDehydrateQuery({ state: query.state }),
      shouldDehydrateMutation: () => false,
    });
    await idbSet(QUERY_CACHE_KEY, state);
  } catch {
    return;
  }
};
