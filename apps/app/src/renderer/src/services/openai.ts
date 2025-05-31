import { createOpenAI } from '@ai-sdk/openai'
import { env } from '../env'

export const openai = createOpenAI({
	apiKey: env.VITE_OPENAI_API_KEY
})
