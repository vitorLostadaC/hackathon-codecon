import { curseRoutes } from './modules/curse/curse.controller'
import { paymentRoutes } from './modules/payment/payment.controller'
import { webhookRoutes } from './modules/webhook/webhook.controller'
import type { FastifyTypedInstance } from './types/fastify'

export async function routes(app: FastifyTypedInstance) {
	app.register(curseRoutes, { prefix: '/curse' })
	app.register(paymentRoutes, { prefix: '/payment' })
	app.register(webhookRoutes, { prefix: '/webhook' })
}
