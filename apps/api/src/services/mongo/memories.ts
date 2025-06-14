import type { ObjectId, WithId } from 'mongodb'
import { MAX_LONG_MEMORY_LENGTH, MAX_SHORT_MEMORY_LENGTH } from '../../constants/memory'
import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'
import type { Memory } from '../../types/memory'

interface GetMemoriesProps {
	userId: string
	type: 'short' | 'long'
}

export const getMemories = async ({
	userId,
	type
}: GetMemoriesProps): Promise<WithId<Memory>[]> => {
	const db = await getDb()

	const memories = db
		.collection<Memory>(Collections.Memories)
		.find({ type, expired: false, userId })
		.limit(type === 'short' ? MAX_SHORT_MEMORY_LENGTH : MAX_LONG_MEMORY_LENGTH)
		.sort({ date: -1 })
		.toArray()

	return memories
}

interface CreateMemoryProps {
	userId: string
	type: 'short' | 'long'
	role: 'user' | 'assistant'
	content: string
}

export const createMemory = async ({
	userId,
	type,
	role,
	content
}: CreateMemoryProps): Promise<void> => {
	const db = await getDb()

	await db.collection(Collections.Memories).insertOne({
		userId,
		type,
		expired: false,
		role,
		content: content,
		date: new Date().toISOString()
	})
}

interface ExpireMemoryProps {
	userId: string
	memoryId: ObjectId
}

export const expireMemory = async ({ userId, memoryId }: ExpireMemoryProps): Promise<void> => {
	const db = await getDb()

	await db
		.collection(Collections.Memories)
		.updateOne({ _id: memoryId, userId }, { $set: { expired: true } })
}

interface ExpireMemoriesProps {
	userId: string
	memoryIds: ObjectId[]
}

export const expireMemories = async ({ userId, memoryIds }: ExpireMemoriesProps): Promise<void> => {
	const db = await getDb()

	await db
		.collection(Collections.Memories)
		.updateMany({ _id: { $in: memoryIds }, userId }, { $set: { expired: true } })
}
