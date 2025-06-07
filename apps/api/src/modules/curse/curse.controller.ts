import { curseScreenshotRequestSchema } from '@repo/api-types/curse.dto'
import type { FastifyTypedInstance } from '../../types/fastify'
import { CurseScreenshotUseCase } from './use-cases/curse.use-case'

const curseService = new CurseScreenshotUseCase()

export async function curseRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/screenshot',
		{
			schema: {
				body: curseScreenshotRequestSchema
			}
		},
		async (request, reply) => {
			const { imageBase64, config } = request.body

			const result = await curseService.execute({
				imageBase64,
				config,
				userId: '123'
			})

			return reply.status(200).send(result)
		}
	)
}
