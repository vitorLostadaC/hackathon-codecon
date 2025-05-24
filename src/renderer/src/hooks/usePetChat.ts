import { useEffect, useRef, useState } from 'react'

const MESSAGE_DURATION = 5000
const MESSAGE_INTERVAL = 10000

const MESSAGES = [
  'Oi! Eu sou um pato!',
  'Você viu meu pão?',
  'Quack quack!',
  'Andando por aí...',
  'Preciso de férias!',
  'Você tem milho?'
]

export const usePetChat = (
  onStartChat: () => void,
  onEndChat: () => void
): {
  message: string
  isVisible: boolean
} => {
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const chatTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const showMessage = (): void => {
    onStartChat()
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(randomMessage)
    setIsVisible(true)

    chatTimerRef.current = setTimeout(() => {
      setIsVisible(false)
      onEndChat()
      scheduleNextMessage()
    }, MESSAGE_DURATION)
  }

  const scheduleNextMessage = (): void => {
    messageIntervalRef.current = setTimeout(() => {
      showMessage()
    }, MESSAGE_INTERVAL)
  }

  useEffect(() => {
    scheduleNextMessage()
    return () => {
      if (chatTimerRef.current) clearTimeout(chatTimerRef.current)
      if (messageIntervalRef.current) clearTimeout(messageIntervalRef.current)
    }
  }, [])

  return { message, isVisible }
}
