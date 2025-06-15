import { z } from 'zod'

export const ratingSchema = z.enum(['terrible', 'bad', 'good', 'excellent'], {
	required_error: 'Responde certo po$#@'
})

export const feedbackSchema = z.object({
	userId: z.string(),
	message: z.string(),
	rating: ratingSchema,
	createdAt: z.string()
})

export type Feedback = z.infer<typeof feedbackSchema>
export type Rating = z.infer<typeof ratingSchema>
