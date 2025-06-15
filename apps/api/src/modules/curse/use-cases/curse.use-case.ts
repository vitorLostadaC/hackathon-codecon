import type {
	CurseConfig,
	CurseScreenshotRequest,
	CurseScreenshotResponse
} from '@repo/api-types/curse.dto'
import type { User } from '@repo/api-types/user.dto'
import type { WithId } from 'mongodb'
import { MAX_LONG_MEMORY_LENGTH, MAX_SHORT_MEMORY_LENGTH } from '../../../constants/memory'
import { aggregateTokens } from '../../../helpers/agregate-tokens'
import { catchError } from '../../../helpers/catch-error'
import { consoleDebug } from '../../../helpers/console-debug'
import { AppError } from '../../../helpers/error-handler'
import { cursingGenerate } from '../../../services/ai/cursing-generate'
import { imageAnalyze } from '../../../services/ai/image-analyzer'
import { generateLongMemory, generateShortMemory } from '../../../services/ai/memory-manager'
import { createCurse } from '../../../services/mongo/cursing'
import {
	createMemory,
	expireMemories,
	expireMemory,
	getMemories
} from '../../../services/mongo/memories'
import { chargeUser, getUser, refundUser } from '../../../services/mongo/user'
import type { AiServiceResponse } from '../../../types/ai'
import type { Memory } from '../../../types/memory'

interface Memories {
	shortTermMemories: WithId<Memory>[]
	longTermMemories: WithId<Memory>[]
}

interface GenerationResults {
	responseResult: AiServiceResponse
	memoryResult: AiServiceResponse
	longMemoryResult?: AiServiceResponse
}

interface CurseScreenshotUseCaseRequest extends CurseScreenshotRequest {
	userId: string
}

export class CurseScreenshotUseCase {
	async execute({
		imageBase64,
		config,
		userId
	}: CurseScreenshotUseCaseRequest): Promise<CurseScreenshotResponse> {
		await this.validateUserAndCharge(userId)

		consoleDebug('reading image')

		const [imageTranscriptionResult, memories] = await Promise.all([
			this.analyzeImage(userId, imageBase64),
			this.fetchMemories(userId)
		])

		consoleDebug(`image transcription: ${imageTranscriptionResult.response}`, 'yellow')

		consoleDebug('generating memory and text')

		const [curseResult, generatedMemories] = await Promise.all([
			this.generateCurse(imageTranscriptionResult, memories, config, userId),
			this.generateMemories(imageTranscriptionResult, memories, userId)
		])

		const generationResults: GenerationResults = {
			responseResult: curseResult,
			...generatedMemories
		}

		await Promise.all([
			this.updateMemoriesByLongMemoryResult(userId, memories, generationResults),
			this.saveAssistantResponse(userId, curseResult.response)
		])

		consoleDebug(`response: ${curseResult.response}`, 'yellow')
		consoleDebug('----------done----------', 'green')

		await this.saveCurseRecord(userId, generationResults, imageTranscriptionResult)

		return { message: curseResult.response }
	}

	async validateUserAndCharge(userId: string): Promise<User> {
		const [userError, user] = await catchError(getUser(userId))

		if (userError || !user) {
			throw new AppError('User not found', 'Check your account', 404)
		}

		if (user.credits <= 0) {
			throw new AppError('Insufficient credits', 'User has no credits', 401)
		}

		const [chargeError] = await catchError(chargeUser(userId))

		if (chargeError) {
			throw new AppError('Charge User Failed', chargeError.message, 400)
		}

		return user
	}

	async analyzeImage(userId: string, imageBase64: string) {
		const [imageError, imageTranscriptionResult] = await catchError(imageAnalyze(imageBase64))
		if (imageError) {
			await refundUser(userId)
			throw new AppError('Image Transcription Failed', imageError.message, 400)
		}
		return imageTranscriptionResult
	}

	async fetchMemories(userId: string) {
		const [[shortError, shortTermMemories], [longError, longTermMemories]] = await Promise.all([
			catchError(getMemories({ userId, type: 'short' })),
			catchError(getMemories({ userId, type: 'long' }))
		])

		if (shortError || longError) {
			await refundUser(userId)
			if (shortError) throw new AppError('Short Time Memories Failed', shortError.message, 400)
			if (longError) throw new AppError('Long Time Memories Failed', longError.message, 400)
		}

		return { shortTermMemories, longTermMemories }
	}

	async generateCurse(
		imageTranscriptionResult: AiServiceResponse,
		memories: Memories,
		config: CurseConfig,
		userId: string
	): Promise<AiServiceResponse> {
		const { shortTermMemories, longTermMemories } = memories

		const [responseError, responseResult] = await catchError(
			cursingGenerate(imageTranscriptionResult.response, shortTermMemories, longTermMemories, {
				safeMode: config.safeMode
			})
		)

		if (responseError) {
			await refundUser(userId)
			throw new AppError('Curse Generation Failed', responseError.message, 400)
		}

		return responseResult
	}

	async generateMemories(
		imageTranscriptionResult: AiServiceResponse,
		memories: Memories,
		userId: string
	): Promise<{ memoryResult: AiServiceResponse; longMemoryResult?: AiServiceResponse }> {
		const { shortTermMemories } = memories
		const [[memoryError, memoryResult], [longMemoryError, longMemoryResult]] = await Promise.all([
			catchError(generateShortMemory(imageTranscriptionResult.response)),
			shortTermMemories.length === MAX_SHORT_MEMORY_LENGTH
				? catchError(generateLongMemory(shortTermMemories))
				: Promise.resolve([undefined, undefined])
		])

		if (memoryError || longMemoryError) {
			await refundUser(userId)
			if (memoryError) throw new AppError('Memory Generation Failed', memoryError.message, 400)
			if (longMemoryError)
				throw new AppError('Long Memory Generation Failed', longMemoryError.message, 400)
		}

		return {
			memoryResult,
			...(longMemoryResult !== undefined ? { longMemoryResult } : {})
		}
	}

	async updateMemoriesByLongMemoryResult(
		userId: string,
		memories: Memories,
		generationResults: GenerationResults
	): Promise<void> {
		const { longTermMemories, shortTermMemories } = memories
		const { longMemoryResult } = generationResults

		if (!longMemoryResult) return

		const tasks: Promise<void>[] = []

		if (longTermMemories.length >= MAX_LONG_MEMORY_LENGTH) {
			const oldestMemory = longTermMemories.shift()
			if (oldestMemory) tasks.push(expireMemory({ userId, memoryId: oldestMemory._id }))
		}

		tasks.push(
			createMemory({
				userId,
				type: 'long',
				role: 'user',
				content: longMemoryResult.response
			}),
			expireMemories({
				userId,
				memoryIds: shortTermMemories.map((mem) => mem._id)
			})
		)

		await Promise.all(tasks)
	}

	async saveAssistantResponse(userId: string, response: string): Promise<void> {
		await createMemory({
			userId,
			type: 'short',
			role: 'assistant',
			content: response
		})
	}

	async saveCurseRecord(
		userId: string,
		generationResults: GenerationResults,
		imageTranscriptionResult: AiServiceResponse
	): Promise<void> {
		const { responseResult, memoryResult, longMemoryResult } = generationResults

		const allSteps: AiServiceResponse[] = [
			imageTranscriptionResult,
			memoryResult,
			longMemoryResult,
			responseResult
		].filter((step): step is AiServiceResponse => step !== undefined)

		const totalTokens = aggregateTokens(allSteps.map((step) => step?.tokens))
		const totalDuration = allSteps.reduce((acc, step) => acc + step.duration, 0)

		await createCurse({
			userId,
			response: responseResult.response,
			totalTokens,
			totalDuration,
			allSteps
		})
	}
}
