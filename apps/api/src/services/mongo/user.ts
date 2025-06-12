import type { User } from '@repo/api-types/user.dto'
import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'

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

interface CreateUserProps {
	userId: string
	email: string
	name: string
}

export const createUser = async ({ userId, email, name }: CreateUserProps) => {
	const db = await getDb()
	const user = await db
		.collection<User>(Collections.Users)
		.insertOne({ userId, email, name, credits: 3, createdAt: new Date().toISOString() })
	return user
}
