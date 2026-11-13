// Minimal service worker so the app is installable. No offline caching yet.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("fetch", () => {});
