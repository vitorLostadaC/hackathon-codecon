import { curseRoutes } from './modules/curse/curse.controller'
import type { FastifyTypedInstance } from './types/fastify'

export async function routes(app: FastifyTypedInstance) {
	app.register(curseRoutes, { prefix: '/curse' })
}
