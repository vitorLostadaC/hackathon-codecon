import { useEffect, useRef, useState } from 'react'
import Message from '../message/message'
import './duck.css'

import { getTemporaryMessage } from '@renderer/ai/main'
import duckGif from '../../assets/duck.gif'
import stopedDuck from '../../assets/stoped-duck.png'

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
  const [renderKey, setRenderKey] = useState(0)

  const animationFrameRef = useRef<number | null>(null)
  const directionRef = useRef(direction)
  const prevShowMessageRef = useRef(showMessage)
  const duckWidth = 60
  const duckHeight = 60
  const speed = 2

  useEffect(() => {
    const preloadImages = (): void => {
      const gifImg = new Image()
      gifImg.src = duckGif
      const stopImg = new Image()
      stopImg.src = stopedDuck
    }
    preloadImages()
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const message = await getTemporaryMessage()
        setCurrentMessage(message)
        setShowMessage(true)
      } catch (error) {
        console.log('Error getting message from AI:', error)
      }
    }, 20 * 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  useEffect(() => {
    if (prevShowMessageRef.current !== showMessage) {
      setRenderKey((prev) => prev + 1)
      prevShowMessageRef.current = showMessage
    }
  }, [showMessage])

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

  const handleCloseMessage = (): void => {
    setShowMessage(false)
  }

  const currentImage = showMessage ? stopedDuck : duckGif

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
        key={renderKey}
        className={`duck ${direction === -1 ? 'flip' : ''}`}
        style={{
          left: `${position}px`,
          bottom: '0',
          backgroundImage: `url(${currentImage})`,
          width: `${duckWidth}px`,
          height: `${duckHeight}px`
        }}
      />
    </>
  )
}

export default Duck
