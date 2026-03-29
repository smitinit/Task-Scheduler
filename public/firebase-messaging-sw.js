importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js',
)

firebase.initializeApp({
  apiKey: 'AIzaSyBi0Mesl6oNjPtNw50fM7rMoEK0WxcKd7k',
  authDomain: 'task-scheduler-27efa.firebaseapp.com',
  projectId: 'task-scheduler-27efa',
  messagingSenderId: '246730187786',
  appId: '1:246730187786:web:9fe6f185aeeb343426ebf3',
})

const messaging = firebase.messaging()

// FORCE NEW SW TO REPLACE OLD
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

messaging.onBackgroundMessage((payload) => {
  const notification = payload?.notification ?? {}
  const data = payload?.data ?? {}

  const title = data.title || notification.title || 'Task Scheduler'
  const options = {
    body: data.body || notification.body || 'You have a new notification.',
    icon: data.icon || notification.icon || '/icon-192.png',
    data,
  }

  self.registration.showNotification(title, options)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ('focus' in client) return client.focus()
        }
        return self.clients.openWindow('/')
      }),
  )
})
