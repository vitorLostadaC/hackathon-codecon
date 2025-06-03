import { Collections } from '../../constants/mongo'
import { getDb } from '../../lib/mongo'
import type { AiServiceResponse } from '../../types/ai'
import type { Curse } from '../../types/cursing'

interface CreateCurseProps extends Omit<Curse, 'createdAt' | 'steps'> {
	allSteps: AiServiceResponse[]
}
export const createCurse = async ({
	userId,
	response,
	totalTokens,
	totalDuration,
	allSteps
}: CreateCurseProps) => {
	const db = await getDb()
	const curseCollection = db.collection<Curse>(Collections.Cursing)
	await curseCollection.insertOne({
		userId,
		response,
		totalTokens,
		totalDuration,
		createdAt: new Date().toISOString(),
		steps: allSteps.reduce(
			(acc, step) => {
				acc[step.stepName] = {
					response: step.response,
					duration: step.duration,
					tokens: step.tokens
				}
				return acc
			},
			{} as Curse['steps']
		)
	} satisfies Curse)
}
