// https://jakearchibald.com/2014/offline-cookbook/ used code from Jake Archibald blog.

var staticCacheName = 'restaurant-static-v1';

// install service worker
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(staticCacheName).then(cache => {
			return cache.addAll([
				'/',
				'/index.html',
				'/restaurant.html',
				'/data/restaurants.json',
				'/js/dbhelper.js',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/css/styles.css',
				'/img/1.jpg',
				'/img/2.jpg',
				'/img/3.jpg',
				'/img/4.jpg',
				'/img/5.jpg',
				'/img/6.jpg',
				'/img/7.jpg',
				'/img/8.jpg',
				'/img/9.jpg',
				'/img/10.jpg'
			]);
		}).catch(err => console.log('oh no, chaching failed', err))
	);
});

// avtivate new and delete old service worker version
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.filter(cacheName => {
					return cacheName.startsWith('restaurant-') &&
						cacheName != staticCacheName;
				}).map(cacheName => {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

// if there is a cached version, use it, but fetch and update for next time.
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.open('restaurant-dynamic').then(cache => {
			return caches.match(event.request).then(response => {
				return response || fetch(event.request).then(response => {
					cache.put(event.request, response.clone());
					return response;
				});
			});
		})
	);
});

