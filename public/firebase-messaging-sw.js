importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
)

firebase.initializeApp({
  apiKey: 'YOUR_KEY',
  authDomain: 'YOUR_DOMAIN',
  projectId: 'YOUR_PROJECT',
  messagingSenderId: 'YOUR_SENDER',
  appId: 'YOUR_APP_ID',
})

const messaging = firebase.messaging()

// 🔥 FORCE NEW SW TO REPLACE OLD
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload.notification

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
  })
})
