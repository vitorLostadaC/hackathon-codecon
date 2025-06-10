import type { Payment } from '@repo/api-types/payment.dto'
import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'

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

export const getAllPayments = async (userId: string) => {
	const db = await getDb()

	const payments = await db.collection<Payment>(Collections.Payments).find({ userId }).toArray()

	return payments
}

export const paidPayment = async (gatewayId: string) => {
	const db = await getDb()

	await db
		.collection<Payment>(Collections.Payments)
		.updateOne({ gatewayId }, { $set: { status: 'paid' } })
}
