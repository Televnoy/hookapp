// 1. Меняем версию на v3, чтобы браузер понял: пора обновляться! 🔄
const CACHE_NAME = 'hook-app-v3';

// 2. Расширяем список ресурсов всеми важными иконками 🖼️
const ASSETS = [
  './',
  './index.html',
  './manifest.json', // Добавляем сам манифест
  './favicon.svg',
  './icon-192.png',
  './icon-192-maskable.png', // Маскируемая иконка для Android
  './icon-512.png'
];

// Установка воркера и кеширование ресурсов
self.addEventListener('install', (event) => {
  // skipWaiting заставляет новый вокер активироваться сразу, 
  // не дожидаясь закрытия всех вкладок приложения ⚡
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация и удаление старого кеша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Стратегия: Сначала сеть, если нет — кеш
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
