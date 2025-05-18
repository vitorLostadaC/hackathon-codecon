import { useState, useEffect, useRef } from 'react'
import './duck.css'
import Message from '../message/message'

import duckGif from '../../assets/duck.gif'
import stopedDuck from '../../assets/stoped-duck.png'
import { createMessageScheduler } from './messageService'

declare global {
  interface Window {
    api: {
      onNewMessage: (callback: (message: string) => void) => () => void
    }
  }
}

const Duck: React.FC = () => {
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')

  const animationFrameRef = useRef<number | null>(null)
  const directionRef = useRef(direction)
  const duckWidth = 60
  const duckHeight = 60
  const speed = 2

  // Effect to set up message handling
  useEffect(() => {
    // Subscribe to direct messages from the main process
    const unsubscribe = window.api.onNewMessage((message) => {
      setCurrentMessage(message)
      setShowMessage(true)
    })

    // Set up the message scheduler that will periodically show messages
    const cleanupScheduler = createMessageScheduler(
      // Only show random messages when not already showing a message
      () => !showMessage,
      // Handler for when a message should be shown
      (message) => {
        setCurrentMessage(message)
        setShowMessage(true)
      }
    )

    return () => {
      unsubscribe()
      cleanupScheduler()
    }
  }, [showMessage])

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  const animate = (): void => {
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
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    return () => {
      window.removeEventListener('resize', updateScreenWidth)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [showMessage])

  // Resume animation when message closes
  useEffect(() => {
    if (!showMessage && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [showMessage])

  const handleCloseMessage = (): void => {
    setShowMessage(false)
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
        className={`duck ${direction === -1 ? 'flip' : ''}`}
        style={{
          left: `${position}px`,
          bottom: '0',
          backgroundImage: `url(${showMessage ? stopedDuck : duckGif})`,
          width: `${duckWidth}px`,
          height: `${duckHeight}px`
        }}
      />
    </>
  )
}

export default Duck
