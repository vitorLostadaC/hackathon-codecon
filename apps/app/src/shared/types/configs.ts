export interface Configs {
	general: {
		/**
		 * Interval between each request to the AI
		 */
		cursingInterval: number
		/**
		 * If true, the AI will not say bad words
		 */
		safeMode: boolean
		/**
		 * If true, the AI will be in focus mode
		 */
		focusMode: {
			job: string
		} | null
	}
	appearance: {
		selectedPet: PetType
	}
}

export type PetType = 'duck' | 'capybara' | 'codecon'
