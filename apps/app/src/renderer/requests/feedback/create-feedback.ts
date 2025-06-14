import type { CreateFeedbackDto } from '@repo/api-types/feedback.dto'
import { api } from '../../lib/axios'

interface CreateFeedbackParams extends CreateFeedbackDto {
	userId: string
}

export const createFeedback = (params: CreateFeedbackParams) =>
	api.post(`/feedback/${params.userId}`, params)
