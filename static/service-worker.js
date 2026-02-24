// This service worker immediately unregisters itself.
// It exists to replace a previously cached service worker that was
// incorrectly intercepting PocketBase API requests.
self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', () => {
	self.registration
		.unregister()
		.then(() => self.clients.matchAll())
		.then((clients) => {
			clients.forEach((client) => client.navigate(client.url));
		});
});
