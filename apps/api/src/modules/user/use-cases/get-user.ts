import { getDb } from '../../../lib/mongo'

export class GetUserUseCase {
	async execute(userId: string) {
		const db = await getDb()
		const user = await db.collection('users').findOne({ userId })
		return user
	}
}
