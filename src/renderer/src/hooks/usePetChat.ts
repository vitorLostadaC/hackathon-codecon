import { MESSAGE_DURATION, MESSAGE_INTERVAL, MESSAGES } from '@renderer/constants'
import { useEffect, useRef, useState } from 'react'

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
