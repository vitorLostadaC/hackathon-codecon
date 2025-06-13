import { curseRoutes } from './modules/curse/curse.controller'
import { feedbackRoutes } from './modules/feedback/feedback.controller'
import { paymentRoutes } from './modules/payment/payment.controller'
import { userRoutes } from './modules/user/user.controller'
import { webhookRoutes } from './modules/webhook/webhook.controller'
import type { FastifyTypedInstance } from './types/fastify'

export async function routes(app: FastifyTypedInstance) {
	app.register(curseRoutes, { prefix: '/curse' })
	app.register(paymentRoutes, { prefix: '/payment' })
	app.register(webhookRoutes, { prefix: '/webhook' })
	app.register(userRoutes, { prefix: '/user' })
	app.register(feedbackRoutes, { prefix: '/feedback' })
}
