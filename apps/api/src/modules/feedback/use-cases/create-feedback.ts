import type { CreateFeedbackDto } from '@repo/api-types/feedback.dto'
import type { Feedback } from '@repo/api-types/feedback.schema'
import { createFeedback } from '../../../services/mongo/feedback'

interface CreateFeedbackParams extends CreateFeedbackDto {
	userId: string
}

export class CreateFeedbackUseCase {
	async execute(params: CreateFeedbackParams): Promise<Feedback> {
		const feedback = await createFeedback(params)

		return feedback
	}
}
