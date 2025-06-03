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
			[shortTimeMemoriesError, shortTimeMemories],
			[longTimeMemoriesError, longTimeMemories]
		] = await Promise.all([
			catchError(imageAnalyze(imageBase64)),
			catchError(
				memoriesCollection
					.find({ type: 'short', expired: false, userId })
					.limit(MAX_SHORT_MEMORY_LENGTH)
					.sort({ date: -1 })
					.toArray()
			),
			catchError(
				memoriesCollection
					.find({ type: 'long', expired: false, userId })
					.limit(MAX_LONG_MEMORY_LENGTH)
					.sort({ date: -1 })
					.toArray()
			)
		])

		if (shortTimeMemoriesError) {
			throw new AppError('Short Time Memories Failed', shortTimeMemoriesError.message, 400)
		}

		if (longTimeMemoriesError) {
			throw new AppError('Long Time Memories Failed', longTimeMemoriesError.message, 400)
		}

		console.log('shortTimeMemories', shortTimeMemories)
		console.log('longTimeMemories', longTimeMemories)

		if (imageTranscriptionError) {
			throw new AppError('Image Transcription Failed', imageTranscriptionError.message, 400)
		}

		consoleDebug(`image transcription: ${imageTranscriptionResult.response}`, 'yellow')

		consoleDebug('generating memory and text')

		const [[responseResultError, responseResult], [, memoryResult], [, longMemoryResult]] =
			await Promise.all([
				catchError(
					cursingGenerate(imageTranscriptionResult.response, shortTimeMemories, longTimeMemories, {
						safeMode: config.safeMode
					})
				),
				catchError(generateShortMemory(imageTranscriptionResult.response)),
				shortTimeMemories.length === MAX_SHORT_MEMORY_LENGTH
					? catchError(generateLongMemory(shortTimeMemories))
					: Promise.resolve([undefined, undefined])
			])

		if (longMemoryResult) {
			if (longTimeMemories.length === MAX_LONG_MEMORY_LENGTH) {
				const oldestMemory = longTimeMemories.shift()
				if (oldestMemory) {
					await memoriesCollection.updateOne(
						{ _id: oldestMemory._id, userId },
						{ $set: { expired: true } }
					)
				}
			}

			await memoriesCollection.insertOne({
				userId,
				type: 'long',
				expired: false,
				role: 'user',
				content: longMemoryResult.response,
				date: new Date().toISOString()
			})

			await memoriesCollection.updateMany(
				{ userId, _id: { $in: shortTimeMemories.map((mem) => mem._id) } },
				{ $set: { expired: true } }
			)
		}

		if (memoryResult?.response) {
			await memoriesCollection.insertOne({
				userId,
				type: 'short',
				expired: false,
				role: 'user',
				content: `Descrição da tela: ${memoryResult.response}`,
				date: new Date().toISOString()
			})
		}

		if (responseResultError) {
			throw new AppError('Curse Generation Failed', responseResultError.message, 400)
		}

		const responseText = responseResult?.response

		await memoriesCollection.insertOne({
			userId,
			type: 'short',
			expired: false,
			role: 'assistant',
			content: responseText,
			date: new Date().toISOString()
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
