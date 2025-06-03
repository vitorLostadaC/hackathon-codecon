export interface Curse {
	userId: string
	createdAt: string
	response: string
	/**
	 * @description The total duration of the curse in seconds with 2 decimal places
	 */
	totalDuration: number
	totalTokens: {
		[modelId: string]: {
			input: number
			output: number
		}
	}
	steps: {
		[stepSlug: string]: {
			response: string
			/**
			 * @description The duration of the step in seconds with 2 decimal places
			 */
			duration: number
			tokens: {
				[modelId: string]: {
					input: number
					output: number
				}
			}
		}
	}
}
