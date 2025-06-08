import { z } from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify'
import { GetUserUseCase } from './use-cases/get-user'

const getUserUseCase = new GetUserUseCase()

export async function userRoutes(fastify: FastifyTypedInstance) {
	fastify.get(
		'/:userId',
		{
			schema: {
				params: z.object({
					userId: z.string()
				})
			}
		},
		async (request, reply) => {
			const { userId } = request.params

			const result = await getUserUseCase.execute(userId)

			return reply.status(200).send(result)
		}
	)
}
