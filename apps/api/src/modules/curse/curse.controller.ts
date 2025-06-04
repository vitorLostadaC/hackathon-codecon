import type { CurseScreenshotRequest } from '@repo/api-types/curse.dto'
import { curseScreenshotRequestSchema } from '@repo/api-types/curse.dto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { FastifyTypedInstance } from '../../types/fastify'
import { CurseScreenshot } from './use-cses/curse.use-case'

const curseService = new CurseScreenshot()

export async function curseRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/screenshot',
		{
			schema: {
				body: curseScreenshotRequestSchema
			}
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			const { imageBase64, config } = request.body as CurseScreenshotRequest

			const result = await curseService.execute({
				imageBase64,
				config,
				userId: '123'
			})

			return reply.status(200).send(result)
		}
	)
}
