/* Forme : garde l'appli disponible hors ligne et envoie les petits mots de ta mascotte.
   Les données viennent de ta feuille et ne sont pas mises en cache ici. */
var C = 'forme-v6';
var META = 'forme-meta';
var FILES = ['./', './index.html', './style.css', './base.js', './donnees.js', './moi.js', './profil.js', './seance.js', './objectifs.js',
  './glow.js', './variantes.js', './mascotte.js', './cycle.js', './accueil.js', './demarrage.js', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== C && x !== META; }).map(function (x) { return caches.delete(x); }));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET' || u.pathname.indexOf('__pet') >= 0) { return; }
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(function (r) {
      var cp = r.clone();
      caches.open(C).then(function (c) { c.put(e.request, cp); });
      return r;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || caches.match('./index.html'); });
    })
  );
});

/* ---------- « Tu me manques… » : vérifié en arrière-plan par Chrome (environ 1 fois toutes les 12 h) ---------- */
var LINES = {
  1: ['Tu me manques… 🥺', 'Coucou, tu es où ? Je m’ennuie un peu…', 'Je t’attends près de la porte… 🚪'],
  2: ['Ça fait 2 jours… tu me manques 🥺', 'J’ai gardé ta place à la salle… on y va ? 🏋️', 'Je m’ennuie sans toi… un petit câlin ?'],
  4: ['Tu m’as oublié ? 😢 Ça fait {d} jours…', '{d} jours sans toi… je regarde la porte toute la journée 🥺', 'Reviens, je t’ai gardé une friandise 🎁']
};
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function petCheck() {
  return caches.open(META).then(function (c) {
    return c.match('./__pet').then(function (r) { return r ? r.json() : null; }).then(function (m) {
      if (!m || !m.notif) { return; }
      var now = Date.now(), h = new Date().getHours(), away = now - (m.last || now);
      if (h < 9 || h >= 22) { return; }
      if (away < 30 * 3600e3 || now - (m.lastNotif || 0) < 20 * 3600e3) { return; }
      var d = Math.floor(away / 864e5), L = d >= 4 ? LINES[4] : d >= 2 ? LINES[2] : LINES[1];
      var body = pick(L).replace('{d}', d);
      if (m.user && Math.random() < 0.5) { body = m.user + '… ' + body.charAt(0).toLowerCase() + body.slice(1); }
      m.lastNotif = now;
      return c.put('./__pet', new Response(JSON.stringify(m), { headers: { 'Content-Type': 'application/json' } })).then(function () {
        return self.registration.showNotification((m.name || 'Mochi') + ' ' + (m.emoji || '🐱'), {
          body: body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'forme-pet', renotify: true, data: { url: './' }
        });
      });
    });
  }).catch(function () {});
}
self.addEventListener('periodicsync', function (e) {
  if (e.tag === 'forme-pet') { e.waitUntil(petCheck()); }
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if ('focus' in cs[i]) { return cs[i].focus(); } }
    return self.clients.openWindow('./');
  }));
});
