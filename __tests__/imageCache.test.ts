import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  IMAGE_CACHE_NAME,
  IMAGE_META_CACHE_NAME,
  IMAGE_CACHE_TTL_MS,
  handleImageRequest,
  shouldRevalidateImage,
} from "../public/image-cache.js";

type MemoryCache = {
  match: (req: RequestInfo) => Promise<Response | undefined>;
  put: (req: RequestInfo, res: Response) => Promise<void>;
};

const keyOf = (req: RequestInfo) =>
  typeof req === "string" ? req : req.url;

const createCache = (): MemoryCache => {
  const store = new Map<string, Response>();

  return {
    match: async (req) => {
      const hit = store.get(keyOf(req));
      return hit ? hit.clone() : undefined;
    },
    put: async (req, res) => {
      store.set(keyOf(req), res);
    },
  };
};

const installCaches = (buckets: Map<string, ReturnType<typeof createCache>>) => {
  const open = async (name: string) => {
    const existing = buckets.get(name);
    if (existing) {
      return existing;
    }

    const created = createCache();
    buckets.set(name, created);
    return created;
  };

  vi.stubGlobal("caches", {
    open,
    match: async (req: RequestInfo) => {
      for (const bucket of buckets.values()) {
        const hit = await bucket.match(req);
        if (hit) {
          return hit;
        }
      }

      return undefined;
    },
  });
};

describe("shouldRevalidateImage", () => {
  const now = 1_700_000_000_000;

  it("revalidates when the image was never cached", () => {
    expect(shouldRevalidateImage(undefined, now)).toBe(true);
    expect(shouldRevalidateImage(null, now)).toBe(true);
  });

  it("keeps a hit that is younger than four hours", () => {
    expect(shouldRevalidateImage(now, now)).toBe(false);
    expect(shouldRevalidateImage(now - IMAGE_CACHE_TTL_MS + 1, now)).toBe(false);
  });

  it("revalidates at four hours and older", () => {
    expect(shouldRevalidateImage(now - IMAGE_CACHE_TTL_MS, now)).toBe(true);
    expect(shouldRevalidateImage(now - IMAGE_CACHE_TTL_MS - 1, now)).toBe(true);
  });
});

describe("handleImageRequest", () => {
  const photo = "https://cdn.example/leader.jpg";
  const now = 1_700_000_000_000;
  let buckets: Map<string, ReturnType<typeof createCache>>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    buckets = new Map();
    installCaches(buckets);
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(Date, "now").mockReturnValue(now);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const request = () => new Request(photo);
  const extend = () => {
    const tasks: Promise<unknown>[] = [];
    return {
      tasks,
      extendLifetime: (task: Promise<unknown>) => {
        tasks.push(task);
      },
    };
  };

  const seed = async (cachedAt: number, body = "cached") => {
    const imageCache = createCache();
    const metaCache = createCache();
    buckets.set(IMAGE_CACHE_NAME, imageCache);
    buckets.set(IMAGE_META_CACHE_NAME, metaCache);
    await imageCache.put(photo, new Response(body, { status: 200 }));
    await metaCache.put(
      "/__image-meta",
      new Response(JSON.stringify({ [photo]: cachedAt }), {
        headers: { "Content-Type": "application/json" },
      }),
    );
  };

  it("fetches and stores a miss, then returns the network body", async () => {
    fetchMock.mockResolvedValue(new Response("fresh", { status: 200 }));

    const { extendLifetime, tasks } = extend();
    const response = await handleImageRequest(request(), extendLifetime);

    expect(await response.text()).toBe("fresh");
    expect(tasks).toEqual([]);
    expect(fetchMock).toHaveBeenCalledOnce();

    const stored = await buckets.get(IMAGE_CACHE_NAME)?.match(photo);
    expect(await stored?.text()).toBe("fresh");
  });

  it("returns a fresh cache hit without touching the network", async () => {
    await seed(now - 60_000);
    const { extendLifetime, tasks } = extend();

    const response = await handleImageRequest(request(), extendLifetime);

    expect(await response.text()).toBe("cached");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(tasks).toEqual([]);
  });

  it("returns a stale hit immediately and refreshes in the background", async () => {
    await seed(now - IMAGE_CACHE_TTL_MS);
    fetchMock.mockResolvedValue(new Response("next", { status: 200 }));
    const { extendLifetime, tasks } = extend();

    const response = await handleImageRequest(request(), extendLifetime);

    expect(await response.text()).toBe("cached");
    expect(tasks).toHaveLength(1);

    await Promise.all(tasks);

    expect(fetchMock).toHaveBeenCalledOnce();
    const stored = await buckets.get(IMAGE_CACHE_NAME)?.match(photo);
    expect(await stored?.text()).toBe("next");
  });

  it("keeps the stale photo if the background refresh fails", async () => {
    await seed(now - IMAGE_CACHE_TTL_MS - 1);
    fetchMock.mockRejectedValue(new Error("offline"));
    const { extendLifetime, tasks } = extend();

    const response = await handleImageRequest(request(), extendLifetime);

    expect(await response.text()).toBe("cached");
    await Promise.all(tasks);
    const stored = await buckets.get(IMAGE_CACHE_NAME)?.match(photo);
    expect(await stored?.text()).toBe("cached");
  });
});
