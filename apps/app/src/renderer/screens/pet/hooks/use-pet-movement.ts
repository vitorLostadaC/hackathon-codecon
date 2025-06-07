import { useCallback, useEffect, useRef, useState } from 'react'
import { Direction, MOVEMENT_SPEED, PET_DIMENSIONS } from '../constants/pet'

interface UsePetMovementProps {
	chatRef: React.RefObject<HTMLDivElement | null>
}

interface PetMovementState {
	position: number
	direction: Direction
	chatDirection: Direction
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
	const [state, setState] = useState<PetMovementState>({
		position: 0,
		direction: Direction.RIGHT,
		chatDirection: Direction.RIGHT
	})

	const animationRef = useRef<number | null>(null)
	const isMovingRef = useRef(true)

	const getBoundaries = useCallback(() => {
		const maxPosition = window.innerWidth - PET_DIMENSIONS.width
		const chatWidth = chatRef.current?.offsetWidth ?? 256
		return { maxPosition, chatWidth }
	}, [chatRef])

	const getChatDirection = useCallback(
		(position: number, chatWidth: number): Direction => {
			if (position <= chatWidth - PET_DIMENSIONS.width) {
				return Direction.RIGHT
			}
			if (position + chatWidth >= window.innerWidth) {
				return Direction.LEFT
			}
			return state.chatDirection // Keep current if no change needed
		},
		[state.chatDirection]
	)

	// Handle boundary collisions and direction changes
	const handleMovement = useCallback(
		(currentState: PetMovementState): PetMovementState => {
			const { maxPosition, chatWidth } = getBoundaries()
			const nextPosition = currentState.position + currentState.direction * MOVEMENT_SPEED

			let direction = currentState.direction

			// Hit left boundary
			if (nextPosition <= 0) {
				direction = Direction.RIGHT
			}

			// Hit right boundary
			if (nextPosition >= maxPosition) {
				direction = Direction.LEFT
			}

			// Normal movement
			return {
				position: nextPosition,
				direction,
				chatDirection: getChatDirection(nextPosition, chatWidth)
			}
		},
		[getBoundaries, getChatDirection]
	)

	// Animation loop
	const animate = useCallback(() => {
		if (!isMovingRef.current) return

		setState((prevState) => handleMovement(prevState))
		animationRef.current = requestAnimationFrame(animate)
	}, [handleMovement])

	// Start animation
	useEffect(() => {
		animate()
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}
		}
	}, [animate])

	const stopMovement = useCallback((): void => {
		isMovingRef.current = false
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current)
			animationRef.current = null
		}
	}, [])

	const resumeMovement = useCallback((): void => {
		if (!isMovingRef.current) {
			isMovingRef.current = true
			animate()
		}
	}, [animate])

	return {
		position: state.position,
		direction: state.direction,
		chatDirection: state.chatDirection,
		stopMovement,
		resumeMovement
	}
}
