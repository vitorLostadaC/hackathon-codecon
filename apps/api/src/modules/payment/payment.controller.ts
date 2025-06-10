import { paymentRequestSchema } from '@repo/api-types/payment.dto'
import z from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify'
import { CreatePaymentUseCase } from './use-cases/create-payment.use-case'
import { GetAllPaymentsUseCase } from './use-cases/get-all-payments.use-case'

const createPaymentUseCase = new CreatePaymentUseCase()
const getAllPaymentsUseCase = new GetAllPaymentsUseCase()

export async function paymentRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/create/:userId',
		{
			schema: {
				body: paymentRequestSchema,
				params: z.object({
					userId: z.string()
				})
			}
		},
		async (request, reply) => {
			const { plan, email, phone, document } = request.body
			const { userId } = request.params

			const result = await createPaymentUseCase.execute({
				plan,
				email,
				userId,
				document,
				phone
			})

			return reply.status(200).send(result)
		}
	)
	fastify.get(
		'/all/:userId',
		{
			schema: {
				params: z.object({
					userId: z.string()
				})
			}
		},
		async (request, reply) => {
			const { userId } = request.params

			const result = await getAllPaymentsUseCase.execute(userId)

			return reply.status(200).send(result)
		}
	)
}
