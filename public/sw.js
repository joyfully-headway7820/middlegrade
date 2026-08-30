import {
  IMAGE_CACHE_NAME,
  IMAGE_META_CACHE_NAME,
  handleImageRequest,
} from "./image-cache.js";

const CACHE = "mg-shell-v2";
const KEEP = new Set([CACHE, IMAGE_CACHE_NAME, IMAGE_META_CACHE_NAME]);
const PRECACHE = [
  "/",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await Promise.all(
        PRECACHE.map((url) => cache.add(url).catch(() => undefined)),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !KEEP.has(key))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return;
  }

  if (request.destination === "image") {
    event.respondWith(
      handleImageRequest(request, (task) => {
        event.waitUntil(task);
      }),
    );
    return;
  }

  const loopback =
    self.location.hostname === "localhost" ||
    self.location.hostname === "127.0.0.1";

  if (loopback) {
    return;
  }

  if (url.origin === self.location.origin && (url.pathname === "/api" || url.pathname.startsWith("/api/"))) {
    return;
  }

  event.respondWith(handleGet(request));
});

async function handleGet(request) {
  const cached = await caches.match(request);

  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === "opaque")) {
      const cache = await caches.open(CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (cached) {
      return cached;
    }

    if (request.mode === "navigate") {
      const shell = await caches.match("/");
      if (shell) {
        return shell;
      }
    }

    throw error;
  }
}
