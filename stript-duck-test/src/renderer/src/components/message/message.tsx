import { useState, useEffect, useRef } from 'react'
import React from 'react'
import './message.css'

interface MessageProps {
  message: string
  direction: 1 | -1 // 1 for right, -1 for left
  position: number
  isVisible: boolean
  onClose: () => void
}

const Message: React.FC<MessageProps> = ({ message, direction, position, isVisible, onClose }) => {
  const [fadeClass, setFadeClass] = useState('')
  const [actualDirection, setActualDirection] = useState(direction)
  const messageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && messageRef.current) {
      const screenWidth = window.innerWidth
      const messageWidth = messageRef.current.offsetWidth

      const safetyMargin = 20

      if (direction === 1 && position + 70 + messageWidth + safetyMargin > screenWidth) {
        setActualDirection(-1)
      } else if (direction === -1 && position - 10 - messageWidth - safetyMargin < 0) {
        setActualDirection(1)
      } else {
        setActualDirection(direction)
      }

      setFadeClass('fade-in')

      const timer = setTimeout(() => {
        setFadeClass('fade-out')
        setTimeout(onClose, 500)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, position, direction])

  useEffect(() => {
    const handleResize = (): void => {
      if (messageRef.current) {
        const screenWidth = window.innerWidth
        const messageWidth = messageRef.current.offsetWidth
        const safetyMargin = 20

        if (actualDirection === 1 && position + 70 + messageWidth + safetyMargin > screenWidth) {
          setActualDirection(-1)
        } else if (actualDirection === -1 && position - 10 - messageWidth - safetyMargin < 0) {
          setActualDirection(1)
        }
      }
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [actualDirection, position])

  if (!isVisible) return null

  const balloonPosition = {
    left: actualDirection === 1 ? `${position + 70}px` : 'auto',
    right: actualDirection === -1 ? `calc(100% - ${position - 10}px)` : 'auto'
  }

  return (
    <div ref={messageRef} className={`message-balloon ${fadeClass}`} style={balloonPosition}>
      <div className="message-content">{message}</div>
      <div className={`message-tail ${actualDirection === -1 ? 'left' : 'right'}`}></div>
    </div>
  )
}

export default Message
