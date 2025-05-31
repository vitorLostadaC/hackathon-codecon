import { z } from 'zod'

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development')
})

export const env = envSchema.parse(process.env)
