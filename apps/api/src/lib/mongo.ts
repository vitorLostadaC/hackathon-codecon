import { MongoClient } from 'mongodb'
import { env } from '../env'

let client: MongoClient | null = null

export async function getClient() {
	if (!client) {
		client = new MongoClient(env.MONGO_URI)
		await client.connect()
	}
	return client
}

export async function getDb() {
	const client = await getClient()
	return client.db('pato-puto') // I know it's not a good name, not professional, and it's in Portuguese, but I loved this name
}
