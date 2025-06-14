import type { Payment } from '@repo/api-types/payment.dto'
import { AppError } from '../../../helpers/error-handler'
import { getPixPaymentById } from '../../../services/mongo/payment'

export class GetPixPaymentUseCase {
	async execute(paymentId: string): Promise<Payment> {
		const payment = await getPixPaymentById(paymentId)

		if (!payment) {
			throw new AppError('Payment not found', 'Payment not found', 404)
		}

		return payment
	}
}
