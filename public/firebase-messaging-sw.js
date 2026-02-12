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

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload.notification

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
  })
})
