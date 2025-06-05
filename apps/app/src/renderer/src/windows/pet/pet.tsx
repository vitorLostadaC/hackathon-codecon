import { useRef } from 'react'
import duckWalking from '../../assets/animals/duck/duck.gif'
import duckStopped from '../../assets/animals/duck/stopped-duck.png'
import { Chat } from './chat'
import { PET_DIMENSIONS } from './constants'
import { usePetChat } from './hooks/usePetChat'
import { usePetMovement } from './hooks/usePetMovement'

enum PetState {
	WALKING = 'walking',
	PRINTING = 'printing',
	STOPPED = 'stopped'
}

export const Pet = (): React.JSX.Element => {
	const currentStateRef = useRef<PetState>(PetState.WALKING)

	const { position, direction, chatDirection, stopMovement, resumeMovement } = usePetMovement()

	const { message, isVisible } = usePetChat({
		onMessageShow: () => {
			currentStateRef.current = PetState.STOPPED
			stopMovement()
		},
		onMessageHide: () => {
			currentStateRef.current = PetState.WALKING
			resumeMovement()
		}
	})

	const duckStyle = {
		left: `${position}px`,
		transform: `scaleX(${direction})`
	}

	return (
		<div className="relative h-screen overflow-hidden">
			{isVisible && (
				<div className="absolute bottom-0" style={{ left: `${position}px` }}>
					<Chat message={message} isVisible direction={chatDirection} />
				</div>
			)}
			<div
				className="absolute bottom-0"
				style={{
					...duckStyle,
					width: PET_DIMENSIONS.width,
					height: PET_DIMENSIONS.height
				}}
			>
				<img
					src={currentStateRef.current === PetState.WALKING ? duckWalking : duckStopped}
					alt="Duck"
					className="w-full h-full object-contain"
				/>
			</div>
		</div>
	)
}
