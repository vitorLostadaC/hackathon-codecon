import { paymentRequestSchema } from '@repo/api-types/payment.dto'
import type { FastifyTypedInstance } from '../../types/fastify'
import { CreatePaymentUseCase } from './use-cases/payment.use-case'

const paymentService = new CreatePaymentUseCase()

export async function paymentRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/create',
		{
			schema: {
				body: paymentRequestSchema
			}
		},
		async (request, reply) => {
			const { plan } = request.body

			const result = await paymentService.execute({
				plan,
				email: 'test@test.com'
			})

			return reply.status(200).send(result)
		}
	)
}
