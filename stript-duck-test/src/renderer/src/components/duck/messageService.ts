// Sample duck messages
export const duckMessages = [
  'Oii Anderson! Lembra de mim? Seu patinho, seremos amigos... para sempre.....',
  'Quack! Estou aqui para ajudar você!',
  'Como está indo seu código hoje?',
  'Precisa de ajuda com algum bug?',
  'Lembre-se de fazer uma pausa de vez em quando!'
]

// In a real app, this would fetch from an API
export async function fetchDuckMessages(): Promise<string[]> {
  // Simulating API fetch with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(duckMessages)
    }, 300)
  })
}

// Get a random message from the available messages
export function getRandomMessage(): string {
  return duckMessages[Math.floor(Math.random() * duckMessages.length)]
}

// Type definition for message handler functions
export type MessageHandler = (message: string) => void

// Create a message scheduler that will show messages at random intervals
export function createMessageScheduler(
  shouldShow: () => boolean,
  onShowMessage: MessageHandler,
  intervalMs = 10000
): () => void {
  const intervalId = setInterval(() => {
    if (shouldShow() && Math.random() > 0.1) {
      onShowMessage(getRandomMessage())
    }
  }, intervalMs)

  // Return cleanup function
  return () => clearInterval(intervalId)
}
