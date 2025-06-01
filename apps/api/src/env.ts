import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  OPENAI_API_KEY: z.string()
})

export const env = envSchema.parse(process.env)
