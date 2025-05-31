export interface Memory {
	role: 'user' | 'assistant'
	content: string
	date: string
}

export interface AiResponse<Response> {
	usage: {
		promptTokens: number
		completionTokens: number
	}
	response: Response
}

export interface TokenUsage {
	input: number
	output: number
}

export interface GetScreenContextReplyResponse {
	tokens: {
		'gpt-4.1-nano': TokenUsage
		'gpt-4.1': TokenUsage
	}
	response: string
}
