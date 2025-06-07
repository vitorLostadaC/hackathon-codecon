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
	}
	appearance: {
		selectedPet: string
	}
}
