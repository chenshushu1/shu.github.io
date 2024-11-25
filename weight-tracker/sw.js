const CACHE_NAME = 'weight-tracker-v1';
const ASSETS = [
    '/shu.github.io/',
    '/shu.github.io/index.html',
    '/shu.github.io/styles.css',
    '/shu.github.io/app.js',
    '/shu.github.io/manifest.json',
    '/shu.github.io/images/icon-152.png',
    '/shu.github.io/images/icon-167.png',
    '/shu.github.io/images/icon-180.png',
    '/shu.github.io/images/icon-192.png',
    '/shu.github.io/images/icon-512.png'
];

// 安装 Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// 处理请求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果在缓存中找到响应，则返回缓存的响应
                if (response) {
                    return response;
                }
                // 否则发送网络请求
                return fetch(event.request)
                    .then(response => {
                        // 检查是否收到有效的响应
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // 克隆响应，因为响应流只能使用一次
                        const responseToCache = response.clone();
                        // 将响应添加到缓存
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});
