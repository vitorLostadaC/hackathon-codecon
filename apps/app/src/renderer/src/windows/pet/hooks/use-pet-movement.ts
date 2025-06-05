import { Direction, MOVEMENT_SPEED, PET_DIMENSIONS } from '@renderer/windows/pet/constants/pet'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UsePetMovementProps {
	chatRef: React.RefObject<HTMLDivElement | null>
}

export const usePetMovement = ({
	chatRef
}: UsePetMovementProps): {
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

			const chatElement = chatRef.current
			const chatWidth = chatElement ? chatElement.offsetWidth : 256

			if (nextPos <= chatWidth - PET_DIMENSIONS.width) {
				setChatDirection(Direction.RIGHT)
			} else if (nextPos + chatWidth >= window.innerWidth) {
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
