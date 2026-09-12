const CACHE_NAME = "goatjourney-assets-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("goatjourney-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !url.pathname.startsWith("/_next/static/") ||
    url.search
  )
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(request);
      if (hit) return hit;
      const response = await fetch(request);
      if (response.ok && response.type === "basic")
        await cache.put(request, response.clone());
      return response;
    })(),
  );
});
