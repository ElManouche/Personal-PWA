const cacheName = "SD-v1.0.5",
      assets = [
        '/',
        '/index.html',
        '/manifest.json',
        '/assets/js/script.js',
        '/assets/css/style.css',
        '/assets/icons/favicon.svg',
        '/assets/icons/android-chrome-144x144.png'
      ];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('caches some stuff');
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', evt => {
  if (evt.request.url.includes("?cc")) {
    caches.delete(cacheName);
    console.log('delete all the cache');
  }
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      console.log('Responding:', evt.request.url, cacheRes);
      return cacheRes || fetch(evt.request);
    })
  );
});
