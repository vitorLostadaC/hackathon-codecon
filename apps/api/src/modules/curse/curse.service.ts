import type { CurseScreenshotRequest, CurseScreenshotResponse } from '@repo/api-types/curse.dto'
import { MAX_LONG_MEMORY_LENGTH, MAX_SHORT_MEMORY_LENGTH } from '../../constants/memory'
import { aggregateTokens } from '../../helpers/agregate-tokens'
import { catchError } from '../../helpers/catch-error'
import { consoleDebug } from '../../helpers/console-debug'
import { AppError } from '../../lib/error-handler'
import { cursingGenerate } from '../../services/ai/cursing-generate'
import { imageAnalyze } from '../../services/ai/image-analyzer'
import { generateLongMemory, generateShortMemory } from '../../services/ai/memory-manager'
import type { Memory } from '../../types/ai'

let shortTimeMemories: Memory[] = []
const longTimeMemories: Memory[] = []

export class CurseService {
	async curseScreenshot({
		imageBase64,
		config
	}: CurseScreenshotRequest): Promise<CurseScreenshotResponse> {
		consoleDebug('reading image')

		const [imageTranscriptionError, imageTranscriptionResult] = await catchError(
			imageAnalyze(imageBase64)
		)

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
				longTimeMemories.shift()
			}

			longTimeMemories.push({
				role: 'user',
				content: longMemoryResult.response,
				date: new Date().toISOString()
			})
			shortTimeMemories = []
		}

		if (memoryResult?.response) {
			shortTimeMemories.push({
				role: 'user',
				content: `Descrição da tela: ${memoryResult.response}`,
				date: new Date().toISOString()
			})
		}

		if (responseResultError) {
			throw new AppError('Curse Generation Failed', responseResultError.message, 400)
		}

		const responseText = responseResult?.response

		shortTimeMemories.push({
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
