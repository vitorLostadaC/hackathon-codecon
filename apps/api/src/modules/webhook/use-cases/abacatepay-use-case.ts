import { plans } from '@repo/api-types/payment.dto'
import { env } from '../../../env'
import { AppError } from '../../../helpers/error-handler'
import { getPaymentByGatewayId, paidPayment } from '../../../services/mongo/payment'
import { addCredits } from '../../../services/mongo/user'
import type { PaymentWebhookPayload } from '../../../types/payment'

export class AbacatePayWebhook {
	async execute(secret: string, event: PaymentWebhookPayload) {
		if (secret !== env.ABACATEPAY_SECRET_KEY) {
			throw new AppError('Webhook secret mismatch', 'Secret does not match', 401)
		}

		if (event.event !== 'billing.paid') {
			throw new AppError('Unexpected webhook event', `Got "${event.event}"`, 400)
		}

		const gatewayId = event.data.pixQrCode.id

		const payment = await getPaymentByGatewayId(gatewayId)

		if (!payment) {
			throw new AppError('Payment not found', 'Payment not found', 404)
		}

		await paidPayment(gatewayId)
		await addCredits(payment.userId, plans[payment.plan].credits)
	}
}
