// Lưu sẵn vỏ app để mở được khi mất sóng. Dữ liệu đi qua hàng chờ trong store.js.
const BAN = 'kas-v6';
const VO_APP = ['./', 'index.html', 'styles.css', 'icon.svg', 'manifest.webmanifest',
  'js/app.js', 'js/store.js', 'js/schedule.js', 'js/api.js', 'js/anh.js', 'js/khach.js', 'js/hopdong.js', 'js/thietke.js', 'js/kehoach.js', 'js/thuchi.js', 'data/thu-vien-v1.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(BAN).then((c) => c.addAll(VO_APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== BAN).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Có mạng thì lấy bản mới và cập nhật bộ nhớ; mất mạng thì dùng bản đã lưu.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((r) => { const copy = r.clone(); caches.open(BAN).then((c) => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
