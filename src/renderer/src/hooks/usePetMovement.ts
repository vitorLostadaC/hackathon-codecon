import { PET_WIDTH, MOVEMENT_SPEED, Direction, CHAT_POSITION } from '@renderer/constants'
import { useEffect, useRef, useState } from 'react'

export const usePetMovement = (): {
  position: number
  direction: Direction
  chatDirection: Direction
  stopMovement: () => void
  resumeMovement: () => void
} => {
  const [position, setPosition] = useState(0)
  const [direction, setDirection] = useState(Direction.RIGHT)
  const [chatDirection, setChatDirection] = useState(Direction.RIGHT)

  const animationFrameRef = useRef<number | null>(null)
  const directionRef = useRef(Direction.RIGHT)

  const updatePosition = (): void => {
    setPosition((prev) => {
      const nextPos = prev + directionRef.current * MOVEMENT_SPEED
      const maxPos = window.innerWidth - PET_WIDTH

      if (nextPos <= 0) {
        directionRef.current = Direction.RIGHT
        setDirection(Direction.RIGHT)
        return 0
      }

      if (nextPos >= maxPos) {
        directionRef.current = Direction.LEFT
        setDirection(Direction.LEFT)
        return maxPos
      }

      if (nextPos <= CHAT_POSITION.RIGHT_THRESHOLD) {
        setChatDirection(Direction.RIGHT)
      } else if (nextPos >= window.innerWidth - CHAT_POSITION.LEFT_THRESHOLD) {
        setChatDirection(Direction.LEFT)
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
