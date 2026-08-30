export const IMAGE_CACHE_NAME = "mg-images-v1";
export const IMAGE_META_CACHE_NAME = "mg-images-meta-v1";
export const IMAGE_CACHE_TTL_MS = 4 * 60 * 60 * 1000;

const META_URL = "/__image-meta";

let writeQueue = Promise.resolve();

export const shouldRevalidateImage = (cachedAt, now) =>
  cachedAt == null || now - cachedAt >= IMAGE_CACHE_TTL_MS;

const readMeta = async () => {
  const cache = await caches.open(IMAGE_META_CACHE_NAME);
  const stored = await cache.match(META_URL);

  if (!stored) {
    return {};
  }

  try {
    return await stored.json();
  } catch {
    return {};
  }
};

const remember = (url, cachedAt) => {
  writeQueue = writeQueue
    .then(async () => {
      const meta = await readMeta();
      meta[url] = cachedAt;
      const cache = await caches.open(IMAGE_META_CACHE_NAME);
      await cache.put(
        META_URL,
        new Response(JSON.stringify(meta), {
          headers: { "Content-Type": "application/json" },
        }),
      );
    })
    .catch(() => undefined);

  return writeQueue;
};

const refreshImage = async (request) => {
  const response = await fetch(request);

  if (response && (response.ok || response.type === "opaque")) {
    const cache = await caches.open(IMAGE_CACHE_NAME);
    await cache.put(request, response.clone());
    await remember(request.url, Date.now());
  }

  return response;
};

export const handleImageRequest = async (request, extendLifetime) => {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cached =
    (await cache.match(request)) ?? (await caches.match(request));

  if (cached) {
    const meta = await readMeta();

    if (shouldRevalidateImage(meta[request.url], Date.now())) {
      extendLifetime(refreshImage(request).catch(() => undefined));
    }

    return cached;
  }

  return refreshImage(request);
};
