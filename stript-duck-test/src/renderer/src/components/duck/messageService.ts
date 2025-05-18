import { getTemporaryMessage } from '@renderer/ai/main'

// Type definition for message handler functions
export type MessageHandler = (message: string) => void

// Create a message scheduler that will show messages at the specified interval
export function createMessageScheduler(
  shouldShow: () => boolean,
  onShowMessage: MessageHandler,
  intervalMs = 10000 // Set default to 30 seconds
): () => void {
  const intervalId = setInterval(async () => {
    if (shouldShow()) {
      try {
        const message = await getTemporaryMessage()
        onShowMessage(message)
      } catch (error) {
        console.error('Error getting message from AI:', error)
        // Fallback message in case of error
        onShowMessage('Quack! System error...')
      }
    }
  }, intervalMs)

  // Return cleanup function
  return () => clearInterval(intervalId)
}
