import { z } from 'zod'
import type { FastifyTypedInstance } from '../types/fastify'
import { CurseService } from './curse.service'

const curseService = new CurseService()

export async function curseRoutes(fastify: FastifyTypedInstance) {
	fastify.post(
		'/screenshot',
		{
			schema: {
				body: z.object({
					imageBase64: z.string()
				})
			}
		},
		async (request, reply) => {
			const { imageBase64 } = request.body

			const result = await curseService.curseScreenshot({ imageBase64 })

			return reply.status(200).send(result)
		}
	)
}
