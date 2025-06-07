import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'
import type { Payment } from '../../types/payment'

export const createPayment = async (payment: Omit<Payment, 'createdAt' | 'status'>) => {
	const db = await getDb()

	await db.collection<Payment>(Collections.Payments).insertOne({
		...payment,
		createdAt: new Date().toISOString(),
		status: 'pending'
	} satisfies Payment)
}

export const getPaymentByGatewayId = async (gatewayId: string) => {
	const db = await getDb()

	const payment = await db.collection<Payment>(Collections.Payments).findOne({ gatewayId })

	return payment
}

export const paidPayment = async (gatewayId: string) => {
	const db = await getDb()

	await db
		.collection<Payment>(Collections.Payments)
		.updateOne({ gatewayId }, { $set: { status: 'paid' } })
}
