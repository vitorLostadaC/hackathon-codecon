import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { getConfigsOptions } from '../../requests/electron-store/config'
import { Chat } from './chat'
import { PET_DIMENSIONS, PetState, pets } from './constants/pet'
import { usePetChat } from './hooks/use-pet-chat'
import { usePetMovement } from './hooks/use-pet-movement'

export const PetScreen = (): React.JSX.Element => {
	const [settingsOpened, setSettingsOpened] = useState(false)
	const currentStateRef = useRef<PetState>(PetState.WALKING)
	const chatRef = useRef<HTMLDivElement>(null)
	const { data: configs } = useQuery(getConfigsOptions())

	useEffect(() => {
		window.api.windows.onOpenSettingsWindow(() => {
			setSettingsOpened(true)
			handleStoppedState()
		})

		window.api.windows.onCloseSettingsWindow(() => {
			setSettingsOpened(false)
			handleWalkingState()
		})
	}, [])

	const { position, direction, chatDirection, stopMovement, resumeMovement } = usePetMovement({
		chatRef
	})

	const { message } = usePetChat({
		onMessageShow: handleStoppedState,
		onMessageHide: handleWalkingState,
		enabled: !settingsOpened
	})

	function handleStoppedState() {
		currentStateRef.current = PetState.STOPPED
		stopMovement()
	}

	function handleWalkingState() {
		currentStateRef.current = PetState.WALKING
		resumeMovement()
	}

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
				<Chat
					message={settingsOpened ? 'Esquilo...' : message}
					direction={chatDirection}
					ref={chatRef}
				/>
				<img
					src={pets[configs?.appearance.selectedPet ?? 'duck'][currentStateRef.current]}
					alt="Duck"
					className="w-full h-full object-contain"
					style={{ transform: `scaleX(${direction})` }}
				/>
			</div>
		</div>
	)
}
