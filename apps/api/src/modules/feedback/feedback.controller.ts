import { createFeedbackDtoSchema } from '@repo/api-types/feedback.dto'
import { z } from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify'
import { CreateFeedbackUseCase } from './use-cases/create-feedback'

const createFeedbackUseCase = new CreateFeedbackUseCase()

export async function feedbackRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/:userId',
		{
			schema: {
				body: createFeedbackDtoSchema,
				params: z.object({
					userId: z.string()
				})
			}
		},
		async (request, reply) => {
			const feedbackData = request.body
			const userId = request.params.userId

			const result = await createFeedbackUseCase.execute({
				...feedbackData,
				userId
			})

			return reply.status(201).send(result)
		}
	)
}
