import type { Feedback } from '@repo/api-types/feedback.schema'
import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'

export const createFeedback = async (feedback: Omit<Feedback, 'createdAt'>): Promise<Feedback> => {
	const db = await getDb()

	const newFeedback: Feedback = {
		...feedback,
		createdAt: new Date().toISOString()
	}

	await db.collection<Feedback>(Collections.Feedback).insertOne(newFeedback)

	return newFeedback
}
