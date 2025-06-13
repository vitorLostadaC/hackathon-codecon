import { z } from 'zod'
//pegar as variaiveis do VITE

const envSchema = z.object({
  VITE_OPENAI_API_KEY: z.string()
})

export const env = envSchema.parse(import.meta.env)
