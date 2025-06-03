import type { CurseScreenshotRequest, CurseScreenshotResponse } from '@repo/api-types/curse.dto'
import { MAX_LONG_MEMORY_LENGTH, MAX_SHORT_MEMORY_LENGTH } from '../../constants/memory'
import { Collections } from '../../constants/mongo'
import { aggregateTokens } from '../../helpers/agregate-tokens'
import { catchError } from '../../helpers/catch-error'
import { consoleDebug } from '../../helpers/console-debug'
import { AppError } from '../../helpers/error-handler'
import { getDb } from '../../lib/mongo'
import { cursingGenerate } from '../../services/ai/cursing-generate'
import { imageAnalyze } from '../../services/ai/image-analyzer'
import { generateLongMemory, generateShortMemory } from '../../services/ai/memory-manager'
import {
	createMemory,
	expireMemories,
	expireMemory,
	getMemories
} from '../../services/mongo/memories'
import type { Memory } from '../../types/memory'

const userId = '123'

export class CurseService {
	async curseScreenshot({
		imageBase64,
		config
	}: CurseScreenshotRequest): Promise<CurseScreenshotResponse> {
		const db = await getDb()

		const memoriesCollection = db.collection<Memory>(Collections.Memories)

		consoleDebug('reading image')

		const [
			[imageTranscriptionError, imageTranscriptionResult],
			[shortTermMemoriesError, shortTermMemories],
			[longTermMemoriesError, longTermMemories]
		] = await Promise.all([
			catchError(imageAnalyze(imageBase64)),
			catchError(getMemories({ userId, type: 'short' })),
			catchError(getMemories({ userId, type: 'long' }))
		])

		if (shortTermMemoriesError) {
			throw new AppError('Short Time Memories Failed', shortTermMemoriesError.message, 400)
		}

		if (longTermMemoriesError) {
			throw new AppError('Long Time Memories Failed', longTermMemoriesError.message, 400)
		}

		if (imageTranscriptionError) {
			throw new AppError('Image Transcription Failed', imageTranscriptionError.message, 400)
		}

		consoleDebug(`image transcription: ${imageTranscriptionResult.response}`, 'yellow')

		consoleDebug('generating memory and text')

		const [[responseResultError, responseResult], [, memoryResult], [, longMemoryResult]] =
			await Promise.all([
				catchError(
					cursingGenerate(imageTranscriptionResult.response, shortTermMemories, longTermMemories, {
						safeMode: config.safeMode
					})
				),
				catchError(generateShortMemory(imageTranscriptionResult.response)),
				shortTermMemories.length === MAX_SHORT_MEMORY_LENGTH
					? catchError(generateLongMemory(shortTermMemories))
					: Promise.resolve([undefined, undefined])
			])

		if (responseResultError) {
			throw new AppError('Curse Generation Failed', responseResultError.message, 400)
		}

		const parallelTasks: Promise<void>[] = []

		if (longMemoryResult) {
			if (longTermMemories.length === MAX_LONG_MEMORY_LENGTH) {
				const oldestMemory = longTermMemories.shift()
				if (oldestMemory) {
					parallelTasks.push(expireMemory({ userId, memoryId: oldestMemory._id }))
				}
			}

			parallelTasks.push(
				createMemory({ userId, type: 'long', role: 'user', content: longMemoryResult.response }),
				expireMemories({ userId, memoryIds: shortTermMemories.map((mem) => mem._id) })
			)
		}

		if (memoryResult?.response)
			parallelTasks.push(
				createMemory({
					userId,
					type: 'short',
					role: 'user',
					content: `Descrição da tela: ${memoryResult.response}`
				})
			)

		await Promise.all(parallelTasks)

		const responseText = responseResult.response

		await createMemory({
			userId,
			type: 'short',
			role: 'assistant',
			content: responseText
		})

		consoleDebug(`response: ${responseResult}`, 'yellow')
		consoleDebug(`result: ${responseText}`, 'yellow')
		consoleDebug('----------done----------', 'green')

		const tokens = aggregateTokens([
			imageTranscriptionResult?.tokens,
			memoryResult?.tokens,
			longMemoryResult?.tokens,
			responseResult?.tokens
		])

		console.log(tokens)

		return { message: responseText }
	}
}
