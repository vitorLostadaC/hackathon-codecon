import { type PaymentRequest, type PaymentResponse, plans } from '@repo/api-types/payment.dto'
import { catchError } from '../../../helpers/catch-error'
import { AppError } from '../../../helpers/error-handler'
import { abacatePay } from '../../../lib/abacatepay'
import { createPayment } from '../../../services/mongo/payment'

interface CreatePaymentRequest extends PaymentRequest {
	userId: string
}

export class CreatePixPaymentUseCase {
	async execute({
		plan,
		email,
		document,
		phone,
		userId,
		name
	}: CreatePaymentRequest): Promise<PaymentResponse> {
		const billing = await abacatePay.pixQrCode.create({
			amount: plans[plan].price * 100,
			description: `${plans[plan].credits} Créditos`,
			expiresIn: 3600, // 1 hour
			customer: {
				name,
				email,
				cellphone: phone,
				taxId: document
			}
		})

		if (billing.error) {
			throw new AppError('Error to create payment', billing.error, 500)
		}

		if (!('data' in billing)) {
			throw new AppError('Invalid billing response', 'Missing QR code', 500)
		}

		const [error, paymentId] = await catchError(
			createPayment({
				userId,
				plan,
				gatewayId: billing.data.id
			})
		)

		if (error) {
			throw new AppError('Error to create payment', error.message, 500)
		}

		return {
			qrCodeBase64: billing.data.brCodeBase64,
			paymentId
		}
	}
}
