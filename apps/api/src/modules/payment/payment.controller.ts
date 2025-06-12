import { paymentRequestSchema } from '@repo/api-types/payment.dto'
import z from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify'
import { CreatePixPaymentUseCase } from './use-cases/create-payment.use-case'
import { GetAllPaymentsUseCase } from './use-cases/get-all-payments.use-case'
import { GetPixPaymentUseCase } from './use-cases/get-pix-payment.use-case'

const createPixPaymentUseCase = new CreatePixPaymentUseCase()
const getAllPaymentsUseCase = new GetAllPaymentsUseCase()
const getPixPaymentUseCase = new GetPixPaymentUseCase()

export async function paymentRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/pix/:userId',
		{
			schema: {
				body: paymentRequestSchema,
				params: z.object({
					userId: z.string()
				})
			}
		},
		async (request, reply) => {
			const { plan, email, phone, document, name } = request.body
			const { userId } = request.params

			const result = await createPixPaymentUseCase.execute({
				plan,
				email,
				userId,
				document,
				phone,
				name
			})

			return reply.status(200).send(result)
		}
	)
	fastify.get(
		'/pix/:paymentId',
		{
			schema: {
				params: z.object({
					paymentId: z.string()
				})
			}
		},
		async (request, reply) => {
			const { paymentId } = request.params

			const result = await getPixPaymentUseCase.execute(paymentId)

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
