import { verifyWebhook } from '@clerk/fastify/webhooks'
import type { FastifyRequest } from 'fastify'
import { catchError } from '../../../helpers/catch-error'
import { AppError } from '../../../helpers/error-handler'
import { createUser } from '../../../services/mongo/user'

export class ClerkUseCase {
	async execute(request: FastifyRequest) {
		const [error, evt] = await catchError(verifyWebhook(request))

		if (error) {
			throw new AppError('Webhook verification failed', error.message, 400)
		}

		if (evt.type !== 'user.created') {
			throw new AppError('Unexpected webhook event', `Got "${evt.type}"`, 400)
		}

		await createUser({
			userId: evt.data.id,
			email: evt.data.email_addresses[0]?.email_address ?? '',
			name: evt.data.first_name ?? 'Unknown'
		})

		return 'Webhook received'
	}
}
