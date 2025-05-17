import { useState, useEffect, useRef } from 'react'
import './Duck.css'

import duckGif from '../../assets/duck.gif'

declare global {
  interface Window {
    api: {
      setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void
    }
  }
}

const Duck: React.FC = () => {
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for right, -1 for left
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [verticalPosition, setVerticalPosition] = useState(0)

  const animationFrameRef = useRef<number | null>(null)
  const directionRef = useRef(direction)
  const duckWidth = 60
  const duckHeight = 60
  const speed = 2

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

    return () => {
      window.removeEventListener('resize', updateScreenWidth)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

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

  return (
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
    />
  )
}

export default Duck
