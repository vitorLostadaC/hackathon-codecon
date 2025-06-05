import { Direction, MOVEMENT_SPEED, PET_DIMENSIONS } from '@renderer/windows/pet/constants'
import { useCallback, useEffect, useRef, useState } from 'react'

const RIGHT_THRESHOLD = 220
const LEFT_THRESHOLD = 274

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

	const updatePosition = useCallback(() => {
		setPosition((prev) => {
			const nextPos = prev + directionRef.current * MOVEMENT_SPEED
			const maxPos = window.innerWidth - PET_DIMENSIONS.width

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

			if (nextPos <= RIGHT_THRESHOLD) {
				setChatDirection(Direction.RIGHT)
			} else if (nextPos >= LEFT_THRESHOLD) {
				setChatDirection(Direction.LEFT)
			}

			return nextPos
		})

		animationFrameRef.current = requestAnimationFrame(updatePosition)
	}, [])

	useEffect(() => {
		animationFrameRef.current = requestAnimationFrame(updatePosition)

		return () => {
			if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
		}
	}, [updatePosition])

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
