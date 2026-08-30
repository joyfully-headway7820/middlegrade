declare module "../public/image-cache.js" {
  export const IMAGE_CACHE_NAME: string;
  export const IMAGE_META_CACHE_NAME: string;
  export const IMAGE_CACHE_TTL_MS: number;
  export const shouldRevalidateImage: (
    cachedAt: number | null | undefined,
    now: number,
  ) => boolean;
  export const handleImageRequest: (
    request: Request,
    extendLifetime: (task: Promise<unknown>) => void,
  ) => Promise<Response>;
}
