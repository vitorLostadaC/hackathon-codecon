export interface TokensUsage {
	input: number
	output: number
}

export interface AiServiceResponse {
	tokens: {
		[modelId: string]: TokensUsage
	}
	stepName: string
	response: string
	/**
	 * @description The duration of the AI service in seconds with 2 decimal places
	 */
	duration: number
}
