import { z } from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify'
import type { PaymentWebhookPayload } from '../../types/payment'
import { AbacatePayWebhook } from './use-cases/abacatepay-use-case'

const abacatePayWebhook = new AbacatePayWebhook()

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
}
