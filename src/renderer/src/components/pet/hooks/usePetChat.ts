import { MESSAGE_DURATION, MESSAGE_INTERVAL, MESSAGES } from '@renderer/components/pet/constants'
import { useEffect, useRef, useState } from 'react'

interface PetChatCallbacks {
  onMessageShow: () => void
  onMessageHide: () => void
}

export const usePetChat = ({
  onMessageShow,
  onMessageHide
}: PetChatCallbacks): {
  message: string
  isVisible: boolean
} => {
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const chatTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const showMessage = (): void => {
    onMessageShow()
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(randomMessage)
    setIsVisible(true)

    chatTimerRef.current = setTimeout(() => {
      setIsVisible(false)
      onMessageHide()
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
