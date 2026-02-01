const CACHE_NAME = 'rg-shell-v1';
const PRECACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/commoncss.css',
    '/manifest.json',
    '/sw.js',
    '/supabasecClient.js',
    '/README.md',
    '/api/og.js',
    '/assets/font/Bangers-Regular.ttf',
    '/assets/font/BowlbyOne-Regular.ttf',
    '/assets/font/digital-italic.ttf',
    '/assets/sound/bg-music.mp3',
    '/assets/sound/card-flip.wav',
    '/assets/sound/card-match.wav',
    '/assets/sound/card-mismatched.wav',
    '/assets/sound/Clock-Ticking-one.mp3',
    '/assets/sound/Clock-ticking-Turning-one.mp3',
    '/assets/sound/error-sound.mp3',
    '/assets/sound/fireworks.mp3',
    '/assets/sound/game-over-classic.mp3',
    '/assets/sound/game-start-1.mp3',
    '/assets/sound/inhalation-and-exhalation.mp3',
    '/assets/sound/laoptop-single-key-press.wav',
    '/assets/sound/Looser.mp3',
    '/assets/sound/single-key-press.mp3',
    '/assets/sound/tap-sound.mp3',
    '/assets/sound/tennis-ball-hit.mp3',
    '/assets/sound/water-flow1.mp3',
    '/assets/sound/winner-trumpets.mp3',
    '/assets/icons/favicon-16x16.png',
    '/assets/icons/rgh-16x16.png',
    '/assets/icons/favicon-32x32.png',
    '/assets/icons/rgh-32x32.png',
    '/assets/icons/rgh-192x192.png',
    '/assets/icons/rgh-512x512.png',
    '/assets/icons/rgh-icon.png',
    '/assets/icons/RGHlogo.png',
    '/assets/icons/rgh.ico',
    '/assets/icons/favicon.ico',
    '/assets/icons/maskable-icon.png',
    '/auth/auth.js',
    '/auth/login.html',
    '/auth/redirect.html',
    '/auth/style.css'
];
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) return caches.delete(key);
          })
        )
      )
    );
  });

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    if (url.origin !== location.origin) {
        // network-first for external
        e.respondWith(fetch(e.request).then(resp => {
            caches.open(CACHE_NAME).then(c => c.put(e.request, resp.clone())); return resp;
        }).catch(() => caches.match(e.request)));
        return;
    }
    // cache-first for app shell
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => { caches.open(CACHE_NAME).then(c => c.put(e.request, resp.clone())); return resp; })).catch(() => caches.match('/index.html')));
});