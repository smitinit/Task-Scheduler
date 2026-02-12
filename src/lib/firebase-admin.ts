import admin from 'firebase-admin'

let app: admin.app.App

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
} else {
  app = admin.app()
}

export const firebaseAdmin = app
export const messaging = admin.messaging()
