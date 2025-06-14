import capybaraStopped from '@renderer/assets/animals/capybara/capybara-stopped.png'
import capybaraWalking from '@renderer/assets/animals/capybara/capybara-walking.gif'
import cuteDuckStopped from '@renderer/assets/animals/cute-duck/cute-duck-stopped.png'
import cuteDuckWalking from '@renderer/assets/animals/cute-duck/cute-duck-walking.gif'
import duckStopped from '@renderer/assets/animals/duck/duck-stopped.png'
import duckWalking from '@renderer/assets/animals/duck/duck-walking.gif'

export const MOVEMENT_SPEED = 0.5

export enum PetState {
	WALKING = 'walking',
	PRINTING = 'printing',
	STOPPED = 'stopped'
}

export enum Direction {
	LEFT = -1,
	RIGHT = 1
}

export const PET_DIMENSIONS = {
	width: 64,
	height: 64
}

export type PetType = 'duck' | 'capybara' | 'cute-duck'

export const pets: Record<PetType, Record<PetState, string>> = {
	duck: {
		[PetState.WALKING]: duckWalking,
		[PetState.STOPPED]: duckStopped,
		[PetState.PRINTING]: duckWalking
	},
	capybara: {
		[PetState.WALKING]: capybaraWalking,
		[PetState.STOPPED]: capybaraStopped,
		[PetState.PRINTING]: capybaraWalking
	},
	'cute-duck': {
		[PetState.WALKING]: cuteDuckWalking,
		[PetState.STOPPED]: cuteDuckStopped,
		[PetState.PRINTING]: cuteDuckWalking
	}
}
