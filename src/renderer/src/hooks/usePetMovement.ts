import { useEffect, useRef, useState } from 'react'

const PET_WIDTH = 64
const MOVEMENT_SPEED = 2

export const usePetMovement = (): {
  position: number
  direction: number
  chatDirection: number
  stopMovement: () => void
  resumeMovement: () => void
} => {
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState(1)
  const [chatDirection, setChatDirection] = useState(1)

  const animationFrameRef = useRef<number | null>(null)
  const directionRef = useRef(1)

  const updatePosition = (): void => {
    setPosition((prev) => {
      const nextPos = prev + directionRef.current * MOVEMENT_SPEED
      const maxPos = window.innerWidth - PET_WIDTH

      if (nextPos <= 0) {
        directionRef.current = 1
        setDirection(1)
        return 0
      }

      if (nextPos >= maxPos) {
        directionRef.current = -1
        setDirection(-1)
        return maxPos
      }

      if (nextPos <= 220) {
        setChatDirection(1)
      } else if (nextPos >= window.innerWidth - 244 - 30) {
        setChatDirection(-1)
      }

      return nextPos
    })

    animationFrameRef.current = requestAnimationFrame(updatePosition)
  }

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updatePosition)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const stopMovement = (): void => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  const resumeMovement = (): void => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(updatePosition)
    }
  }

  return {
    position,
    direction,
    chatDirection,
    stopMovement,
    resumeMovement
  }
}
