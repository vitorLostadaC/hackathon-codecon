import { useState, useEffect, useRef } from 'react'
import './Duck.css'

// Import duck GIF
import duckGif from '../assets/duck.gif'

declare global {
  interface Window {
    api: {
      duckClicked: () => void
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
  const duckWidth = 60 // Adjust based on your GIF size
  const duckHeight = 60 // Adjust based on your GIF size
  const speed = 2 // Pixels per frame

  const animate = (): void => {
    // Update position
    setPosition((prev) => {
      const newPosition = prev + direction * speed

      // Reverse direction when hitting screen edges
      if (newPosition >= screenWidth - duckWidth) {
        setDirection(-1)
        return screenWidth - duckWidth
      } else if (newPosition <= 0) {
        setDirection(1)
        return 0
      }

      return newPosition
    })

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    // Get actual screen dimensions
    const updateScreenWidth = (): void => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', updateScreenWidth)
    updateScreenWidth()

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateScreenWidth)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Handle mouse interactions
  const handleMouseEnter = (): void => {
    setIsHovered(true)
    // Enable mouse events on duck
    window.api.setIgnoreMouseEvents(false)
  }

  const handleMouseLeave = (): void => {
    setIsHovered(false)
    // Make window click-through again
    window.api.setIgnoreMouseEvents(true, { forward: true })
  }

  const handleClick = (): void => {
    // Notify main process about click
    window.api.duckClicked()
    console.log('Duck clicked!')
  }

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent): void => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position,
      y: e.clientY - verticalPosition
    })

    // Pause animation while dragging
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  // Handle drag move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (isDragging) {
        setPosition(e.clientX - dragOffset.x)
        setVerticalPosition(e.clientY - dragOffset.y)
      }
    }

    const handleMouseUp = (): void => {
      setIsDragging(false)

      // Resume animation
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
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    />
  )
}

export default Duck
