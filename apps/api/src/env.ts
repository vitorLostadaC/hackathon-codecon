import { z } from 'zod'

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	OPENAI_API_KEY: z.string(),
	DEBUG: z.string().default('false').transform(Boolean),
	MONGO_URI: z.string(),
	ABACATEPAY_API_KEY: z.string(),
	ABACATEPAY_WEBHOOK_SECRET_KEY: z.string(),
	CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
	CLERK_WEBHOOK_SIGNING_SECRET: z.string()
})

export const env = envSchema.parse(process.env)
