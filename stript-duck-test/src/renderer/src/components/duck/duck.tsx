import { useState, useEffect, useRef } from 'react'
import './duck.css'
import Message from '../message/message'

import duckGif from '../../assets/duck.gif'
import stopedDuck from '../../assets/stoped-duck.png'

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
  const [duckMessages, setDuckMessages] = useState<string[]>([])

  const animationFrameRef = useRef<number | null>(null)
  const directionRef = useRef(direction)
  const duckWidth = 60
  const duckHeight = 60
  const speed = 2

  // Effect to fetch messages from API if available
  useEffect(() => {
    // Get messages from the main process
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

    // Subscribe to new messages
    const unsubscribe = window.api.onNewMessage((message) => {
      setCurrentMessage(message)
      setShowMessage(true)
    })

    // Clean up subscription
    return unsubscribe
  }, [])

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  const animate = (): void => {
    // Don't animate if a message is showing
    if (showMessage) {
      return
    }

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

    if (!showMessage) {
      animationFrameRef.current = requestAnimationFrame(animate)
    } else if (animationFrameRef.current) {
      // Stop animation when message is showing
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Periodically show duck messages
    const messageInterval = setInterval(() => {
      // Only show messages when duck is visible and not being dragged
      if (!isDragging && !showMessage && Math.random() > 0.3 && duckMessages.length > 0) {
        const randomMessage = duckMessages[Math.floor(Math.random() * duckMessages.length)]
        setCurrentMessage(randomMessage)
        setShowMessage(true)
      }
    }, 12000) // Show messages every 12 seconds with 70% chance

    return () => {
      window.removeEventListener('resize', updateScreenWidth)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      clearInterval(messageInterval)
    }
  }, [isDragging, duckMessages, showMessage])

  // Resume animation when message closes
  useEffect(() => {
    if (!showMessage && !isDragging && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [showMessage, isDragging])

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

      if (!animationFrameRef.current && !showMessage) {
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
  }, [isDragging, dragOffset, showMessage])

  // Handle closing the message
  const handleCloseMessage = (): void => {
    setShowMessage(false)
  }

  // Handle duck click to show a message
  const handleDuckClick = (): void => {
    // Only show message on click if not already showing and not dragging
    if (!showMessage && !isDragging && duckMessages.length > 0) {
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
          backgroundImage: `url(${showMessage ? stopedDuck : duckGif})`,
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
