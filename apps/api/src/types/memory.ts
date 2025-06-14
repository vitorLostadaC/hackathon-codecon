export interface Memory {
	userId: string
	content: string
	date: string
	role: 'user' | 'assistant'
	type: 'short' | 'long'
	expired: boolean
}
