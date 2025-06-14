import type { PaymentRequest, PaymentResponse } from '@repo/api-types/payment.dto'
import { api } from '../../lib/axios'

interface CreatePixPaymentRequest extends PaymentRequest {
	userId: string
}

export const createPixPayment = async ({
	userId,
	...rest
}: CreatePixPaymentRequest): Promise<PaymentResponse> => api.post(`/payment/pix/${userId}`, rest)
