import type { FastifyReply, FastifyRequest } from 'fastify'

export class CurseController {
	async curseScreenshot(request: FastifyRequest, reply: FastifyReply) {
		const { imageBase64 } = request.body as { imageBase64: string }

		return { imageBase64 }
	}
}
