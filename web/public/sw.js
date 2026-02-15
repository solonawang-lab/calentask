/* Simple CalenTask service worker (app shell cache) */

const CACHE_NAME = "calentask-shell-v1";

// Add only stable, top-level assets here.
const APP_SHELL = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Navigation: serve cached app shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match("/");
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Other requests: cache-first for same-origin GETs.
  if (request.method === "GET") {
    const url = new URL(request.url);
    if (url.origin === self.location.origin) {
      event.respondWith(
        (async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          try {
            const response = await fetch(request);
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
            return response;
          } catch {
            return cached || Response.error();
          }
        })()
      );
    }
  }
});
