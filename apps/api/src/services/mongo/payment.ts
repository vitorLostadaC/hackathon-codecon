import type { Payment } from '@repo/api-types/payment.dto'
import { ObjectId } from 'mongodb'
import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'

export const createPayment = async (
	payment: Omit<Payment, 'createdAt' | 'status' | 'type'>
): Promise<string> => {
	const db = await getDb()

	const result = await db.collection<Payment>(Collections.Payments).insertOne({
		...payment,
		createdAt: new Date().toISOString(),
		status: 'pending',
		type: 'pix'
	} satisfies Payment)

	return result.insertedId.toString()
}

export const getPaymentByGatewayId = async (gatewayId: string) => {
	const db = await getDb()

	const payment = await db.collection<Payment>(Collections.Payments).findOne({ gatewayId })

	return payment
}

export const getPixPaymentById = async (id: string) => {
	const db = await getDb()

	const payment = await db
		.collection<Payment>(Collections.Payments)
		.findOne({ _id: new ObjectId(id) })

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
