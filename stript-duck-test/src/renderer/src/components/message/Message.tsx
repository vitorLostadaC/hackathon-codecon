import { useState, useEffect } from 'react'
import React from 'react'
import './Message.css'

interface MessageProps {
  message: string
  direction: 1 | -1 // 1 for right, -1 for left
  position: number
  isVisible: boolean
  onClose: () => void
}

const Message: React.FC<MessageProps> = ({ message, direction, position, isVisible, onClose }) => {
  const [fadeClass, setFadeClass] = useState('')

  useEffect(() => {
    if (isVisible) {
      setFadeClass('fade-in')

      // Auto-hide message after 5 seconds
      const timer = setTimeout(() => {
        setFadeClass('fade-out')
        setTimeout(onClose, 500) // Wait for fade out animation before closing
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  // Position the balloon based on the duck's direction
  const balloonPosition = {
    left: direction === 1 ? `${position + 70}px` : 'auto',
    right: direction === -1 ? `calc(100% - ${position - 10}px)` : 'auto'
  }

  return (
    <div className={`message-balloon ${fadeClass}`} style={balloonPosition}>
      <div className="message-content">{message}</div>
      <div className={`message-tail ${direction === -1 ? 'left' : 'right'}`}></div>
      <button
        className="close-button"
        onClick={() => {
          setFadeClass('fade-out')
          setTimeout(onClose, 500)
        }}
      >
        ×
      </button>
    </div>
  )
}

export default Message
