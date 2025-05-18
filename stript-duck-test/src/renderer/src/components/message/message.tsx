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
      // Check if the message would be off screen and adjust direction if needed
      const screenWidth = window.innerWidth
      const messageWidth = messageRef.current.offsetWidth

      // Add a safety margin to prevent compression
      const safetyMargin = 20

      if (direction === 1 && position + 70 + messageWidth + safetyMargin > screenWidth) {
        // If would go off right edge, switch to left
        setActualDirection(-1)
      } else if (direction === -1 && position - 10 - messageWidth - safetyMargin < 0) {
        // If would go off left edge, switch to right
        setActualDirection(1)
      } else {
        setActualDirection(direction)
      }

      setFadeClass('fade-in')

      // Auto-hide message after 10 seconds
      const timer = setTimeout(() => {
        setFadeClass('fade-out')
        setTimeout(onClose, 500) // Wait for fade out animation before closing
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, position, direction])

  // Add a resize event listener to recheck positioning
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

  // Position the balloon based on the actual direction with added safety margin
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
