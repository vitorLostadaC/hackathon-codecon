import { z } from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify'
import type { PaymentWebhookPayload } from '../../types/payment'
import { AbacatePayWebhook } from './use-cases/abacatepay-use-case'
import { ClerkUseCase } from './use-cases/clerk-use-case'

const abacatePayWebhook = new AbacatePayWebhook()
const clerkUseCase = new ClerkUseCase()

export async function webhookRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/abacatepay',
		{
			schema: {
				params: z.object({
					webhookSecret: z.string()
				})
			}
		},
		async (request, reply) => {
			const secret = request.params.webhookSecret
			const event = request.body as PaymentWebhookPayload

			const result = await abacatePayWebhook.execute(secret, event)

			return reply.status(200).send(result)
		}
	)

	fastify.post('/clerk', async (request, reply) => {
		const result = await clerkUseCase.execute(request)

		return reply.status(200).send(result)
	})
}
