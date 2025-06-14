import { curseScreenshotRequestSchema } from '@repo/api-types/curse.dto'
import z from 'zod'
import type { FastifyTypedInstance } from '../../types/fastify'
import { CurseScreenshotUseCase } from './use-cases/curse.use-case'

const curseService = new CurseScreenshotUseCase()

export async function curseRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/screenshot/:userId',
		{
			schema: {
				body: curseScreenshotRequestSchema,
				params: z.object({
					userId: z.string()
				})
			}
		},
		async (request, reply) => {
			const { imageBase64, config } = request.body
			const { userId } = request.params

			const result = await curseService.execute({
				imageBase64,
				config,
				userId
			})

			return reply.status(200).send(result)
		}
	)
}
