import type { FastifyInstance } from 'fastify'
import { CurseController } from './curse.controller'

const curseController = new CurseController()

export async function curseRoutes(fastify: FastifyInstance) {
	fastify.post('/screenshot', curseController.curseScreenshot)
}
