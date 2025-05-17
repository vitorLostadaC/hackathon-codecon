import { useState, useEffect, useRef } from 'react'
import './Duck.css'
import Message from '../message/Message'

import duckGif from '../../assets/duck.gif'

declare global {
  interface Window {
    api: {
      setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void
      getDuckMessages: () => Promise<string[]>
      onNewMessage: (callback: (message: string) => void) => () => void
    }
  }
}

const Duck: React.FC = () => {
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [verticalPosition, setVerticalPosition] = useState(0)

  // Message state
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [duckMessages, setDuckMessages] = useState<string[]>([
    'Quack! Need help with your code?',
    'Did you remember to commit your changes?',
    "Take a break! You've been coding for a while.",
    'Have you tried turning it off and on again?',
    'Remember to stay hydrated while coding!',
    "Quack! Don't forget to write tests for your code.",
    "Maybe it's time to refactor this function?",
    'Quack quack! Your code looks great today!'
  ])

  const animationFrameRef = useRef<number | null>(null)
  const directionRef = useRef(direction)
  const duckWidth = 60
  const duckHeight = 60
  const speed = 2

  // Effect to fetch messages from API if available
  useEffect(() => {
    if (window.api.getDuckMessages) {
      // Try to get messages from the API
      window.api
        .getDuckMessages()
        .then((messages) => {
          if (messages && messages.length > 0) {
            setDuckMessages(messages)
          }
        })
        .catch((error) => {
          console.error('Error fetching duck messages:', error)
        })
    }

    // Subscribe to new messages
    if (window.api.onNewMessage) {
      const unsubscribe = window.api.onNewMessage((message) => {
        setCurrentMessage(message)
        setShowMessage(true)
      })

      // Clean up subscription
      return unsubscribe
    }
  }, [])

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  const animate = (): void => {
    const currentDirection = directionRef.current

    setPosition((prev) => {
      const newPosition = prev + currentDirection * speed

      if (newPosition >= screenWidth - duckWidth) {
        setDirection(-1)
        directionRef.current = -1
        return screenWidth - duckWidth
      } else if (newPosition <= 0) {
        setDirection(1)
        directionRef.current = 1
        return 0
      }

      return newPosition
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const updateScreenWidth = (): void => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', updateScreenWidth)
    updateScreenWidth()

    animationFrameRef.current = requestAnimationFrame(animate)

    // Periodically show duck messages
    const messageInterval = setInterval(() => {
      // Only show messages when duck is visible and not being dragged
      if (!isDragging && Math.random() > 0.7) {
        const randomMessage = duckMessages[Math.floor(Math.random() * duckMessages.length)]
        setCurrentMessage(randomMessage)
        setShowMessage(true)
      }
    }, 10000) // Check every 10 seconds with 30% chance to show a message

    return () => {
      window.removeEventListener('resize', updateScreenWidth)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      clearInterval(messageInterval)
    }
  }, [isDragging, duckMessages])

  const handleMouseEnter = (): void => {
    setIsHovered(true)
    window.api.setIgnoreMouseEvents(false)
  }

  const handleMouseLeave = (): void => {
    setIsHovered(false)
    window.api.setIgnoreMouseEvents(true, { forward: true })
  }

  const handleMouseDown = (e: React.MouseEvent): void => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position,
      y: e.clientY - verticalPosition
    })

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Hide message when starting to drag
    setShowMessage(false)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (isDragging) {
        setPosition(e.clientX - dragOffset.x)
        setVerticalPosition(e.clientY - dragOffset.y)
      }
    }

    const handleMouseUp = (): void => {
      setIsDragging(false)

      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Handle closing the message
  const handleCloseMessage = (): void => {
    setShowMessage(false)
  }

  // Handle duck click to show a message
  const handleDuckClick = (): void => {
    // Only show message on click if not already showing and not dragging
    if (!showMessage && !isDragging) {
      const randomMessage = duckMessages[Math.floor(Math.random() * duckMessages.length)]
      setCurrentMessage(randomMessage)
      setShowMessage(true)
    }
  }

  return (
    <>
      <Message
        message={currentMessage}
        direction={direction}
        position={position}
        isVisible={showMessage}
        onClose={handleCloseMessage}
      />
      <div
        className={`duck ${direction === -1 ? 'flip' : ''} ${isHovered ? 'hovered' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position}px`,
          bottom: isDragging ? 'auto' : '0',
          top: isDragging ? `${verticalPosition}px` : 'auto',
          backgroundImage: `url(${duckGif})`,
          width: `${duckWidth}px`,
          height: `${duckHeight}px`
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onClick={handleDuckClick}
      />
    </>
  )
}

export default Duck
