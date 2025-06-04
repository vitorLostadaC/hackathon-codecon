import { z } from 'zod'

const planSchema = z.object({
	name: z.string(),
	price: z.number(),
	credits: z.number()
})

export const plans: Record<PaymentPlan, Plan> = {
	basic: {
		name: 'Basic',
		price: 4.99,
		credits: 50
	},
	premium: {
		name: 'Premium',
		price: 9.99,
		credits: 150
	},
	'ultra-premium': {
		name: 'Ultra Premium',
		price: 49.99,
		credits: 675
	},
	'ultra-master-premium': {
		name: 'Ultra Master Premium',
		price: 149.99,
		credits: 3750
	}
}

export const paymentPlanSchema = z.enum([
	'basic',
	'premium',
	'ultra-premium',
	'ultra-master-premium'
])

export const paymentRequestSchema = z.object({
	plan: paymentPlanSchema
})

export const paymentResponseSchema = z.object({
	qrCodeBase64: z.string()
})

export type PaymentPlan = z.infer<typeof paymentPlanSchema>
export type PaymentResponse = z.infer<typeof paymentResponseSchema>
export type PaymentRequest = z.infer<typeof paymentRequestSchema>

export type Plan = z.infer<typeof planSchema>
