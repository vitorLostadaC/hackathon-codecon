import type { PaymentPlan } from '@repo/api-types/payment.dto'

export type PaymentWebhookPayload = {
	data: {
		payment: {
			amount: number
			fee: number
			method: 'PIX'
		}
		pixQrCode: {
			amount: number
			id: string
			kind: 'PIX'
			status: 'PAID'
		}
	}
	devMode: boolean
	event: 'billing.paid'
}

export type Payment = {
	userId: string
	cupon?: string
	plan: PaymentPlan
	status: 'pending' | 'paid'
	createdAt: string
	gatewayId: string
}
