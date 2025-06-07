import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'
import type { User } from '../../types/user'

export const getUser = async (userId: string) => {
	const db = await getDb()
	const user = await db.collection<User>(Collections.Users).findOne({ userId })
	return user
}

export const chargeUser = async (userId: string) => {
	const db = await getDb()
	const user = await db
		.collection<User>(Collections.Users)
		.updateOne({ userId }, { $inc: { credits: -1 } })
	return user
}

export const refundUser = async (userId: string) => {
	const db = await getDb()
	const user = await db
		.collection<User>(Collections.Users)
		.updateOne({ userId }, { $inc: { credits: 1 } })
	return user
}

export const addCredits = async (userId: string, credits: number) => {
	const db = await getDb()
	const user = await db
		.collection<User>(Collections.Users)
		.updateOne({ userId }, { $inc: { credits } })
	return user
}
