import { hydrate, type DehydratedState, type QueryClient } from "@tanstack/react-query";
import { idbGet } from "./idb";
import { QUERY_CACHE_KEY } from "./queryCacheKey";

const RESTORE_TIMEOUT = 2000;

export const restoreQueryCache = async (client: QueryClient) => {
  try {
    const state = await Promise.race([
      idbGet<DehydratedState>(QUERY_CACHE_KEY).catch(() => undefined),
      new Promise<undefined>((resolve) => {
        window.setTimeout(() => resolve(undefined), RESTORE_TIMEOUT);
      }),
    ]);

    if (state) {
      hydrate(client, state);
    }
  } catch {
    return;
  }
};
