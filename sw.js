const SHELL_CACHE = "wizardpedia-shell-v1";
const API_CACHE = "wizardpedia-api-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/src/main.js",
  "/src/router.js",
  "/src/styles/style.css",
  "/manifest.json"
];

/* Install: cacha app shell */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

/* Activate: rensa gamla caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![SHELL_CACHE, API_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* Fetch: cache-strategier */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  /* API: network first, cache fallback */
  if (url.hostname.includes("hp-api")) {
    event.respondWith(networkFirst(req));
    return;
  }

  /* App shell: cache first */
  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  const cache = await caches.open(SHELL_CACHE);
  cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(API_CACHE);
    cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;

    return new Response(
      JSON.stringify({ message: "Offline – no new data available right now" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
