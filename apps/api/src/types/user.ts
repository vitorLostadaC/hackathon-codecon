import z from 'zod'

export const userSchema = z.object({
	userId: z.string(),
	email: z.string().email(),
	name: z.string().nullable().default(null),
	credits: z.number().default(3),
	createdAt: z.string()
})

export type User = z.infer<typeof userSchema>
