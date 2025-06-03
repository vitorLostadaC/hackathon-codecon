export interface TokensUsage {
	input: number
	output: number
}

export interface AiServiceResponse {
	tokens: {
		[modelId: string]: TokensUsage
	}
	response: string
}
