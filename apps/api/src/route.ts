import type { FastifyInstance } from 'fastify'
import { curseRoutes } from './modules/curse.route'

export async function routes(app: FastifyInstance) {
	app.register(curseRoutes, { prefix: '/curse' })
}
