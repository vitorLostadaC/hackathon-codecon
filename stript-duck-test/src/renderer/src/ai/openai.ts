import { createOpenAI } from '@ai-sdk/openai'
import { env } from 'process'

export const openai = createOpenAI({
  apiKey: env.VITE_OPENAI_API_KEY
})
