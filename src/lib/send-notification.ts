import { messaging } from './firebase-admin'

export async function sendPushToTokens(
  tokens: Array<string>,
  title: string,
  body: string,
) {
  if (!tokens.length) return

  await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title,
      body,
    },
  })
}
