import { type PaymentRequest, type PaymentResponse, plans } from '@repo/api-types/payment.dto'
import { AppError } from '../../../helpers/error-handler'
import { abacatePay } from '../../../lib/abacatepay'

interface CreatePaymentRequest extends PaymentRequest {
	email: string
}

export class CreatePaymentUseCase {
	async execute({ plan, email }: CreatePaymentRequest): Promise<PaymentResponse> {
		const billing = await abacatePay.pixQrCode.create({
			amount: plans[plan].price * 100,
			description: 'teste',
			expiresIn: 3600, // 1 hour
			customer: {
				name: 'John Doe',
				email,
				cellphone: '4883449696',
				taxId: '11244551910'
			}
		})

		if (billing.error) {
			throw new AppError('Error to create payment', billing.error, 500)
		}

		if (!('data' in billing)) {
			throw new AppError('Invalid billing response', 'Missing QR code', 500)
		}

		return {
			qrCodeBase64: billing.data.brCodeBase64
		}
	}
}
