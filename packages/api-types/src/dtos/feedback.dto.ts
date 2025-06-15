import { z } from 'zod'
import { ratingSchema } from '../schemas/feedback'

export const createFeedbackDtoSchema = z.object({
	message: z.string(),
	rating: ratingSchema
})

export type CreateFeedbackDto = z.infer<typeof createFeedbackDtoSchema>
