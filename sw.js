const cacheName = "SD-v1.0.3-alpha",
      assets = [
        '/',
        '/index.html',
        '/manifest.json',
        '/assets/js/script.js',
        '/assets/css/style.css',
        // Local images
        '/assets/icons/favicon.svg',
        '/assets/icons/android-chrome-144x144.png',
        // CDN images
        'https://ik.imagekit.io/sarahdionne/tr:w-30,fo-auto,f-webp/hero/full.jpg',
        // Externals
        'https://cdn.polyfill.io/v3/polyfill.min.js',
        'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&amp;display=swap'
      ];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      //console.log('caches some stuff');
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

function handleErrors(response) {
  if (!response.ok) {
    //console.log('Houston, weve got a problem');
    throw Error(response.statusText);
  }
  return response;
}

self.addEventListener('fetch', evt => {
  if (evt.request.url.includes("?cc")) {
    caches.delete(cacheName);
    //console.log('delete all the cache');
  }
  if (evt.request.url.match(/\.(?:webp|png|jpg|jpeg|svg)$/)) {
    //console.log('!!! it is an image !!!');
  }
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      //console.log(`Responding ${(cacheRes? 'from cache' : 'go fetch!')}`, evt.request.url);
      return cacheRes || fetch(evt.request)
      //    .then(response => { console.log("ok"); return response; })
    })
  );
});
