export interface Curse {
	userId: string
	response: string
	totalTokens: {
		[modelId: string]: {
			input: number
			output: number
		}
	}
	steps: {
		[stepSlug: string]: {
			response: string
			tokens: {
				[modelId: string]: {
					input: number
					output: number
				}
			}
		}
	}
}
