import duckStopped from '@renderer/assets/animals/duck/duck-stopped.png'
import duckWalking from '@renderer/assets/animals/duck/duck-walking.gif'
import { useRef } from 'react'
import { Chat } from './chat'
import { PET_DIMENSIONS } from './constants/pet'
import { usePetChat } from './hooks/use-pet-chat'
import { usePetMovement } from './hooks/use-pet-movement'

enum PetState {
	WALKING = 'walking',
	PRINTING = 'printing',
	STOPPED = 'stopped'
}

export const Pet = (): React.JSX.Element => {
	const currentStateRef = useRef<PetState>(PetState.WALKING)
	const chatRef = useRef<HTMLDivElement>(null)

	const { position, direction, chatDirection, stopMovement, resumeMovement } = usePetMovement({
		chatRef
	})

	const { message } = usePetChat({
		onMessageShow: () => {
			currentStateRef.current = PetState.STOPPED
			stopMovement()
		},
		onMessageHide: () => {
			currentStateRef.current = PetState.WALKING
			resumeMovement()
		}
	})

	return (
		<div>
			<div
				className="absolute bottom-0"
				style={{
					left: `${position}px`,
					width: PET_DIMENSIONS.width,
					height: PET_DIMENSIONS.height
				}}
			>
				<Chat message={message} direction={chatDirection} ref={chatRef} />
				<img
					src={currentStateRef.current === PetState.WALKING ? duckWalking : duckStopped}
					alt="Duck"
					className="w-full h-full object-contain"
					style={{ transform: `scaleX(${direction})` }}
				/>
			</div>
		</div>
	)
}
