import { catchError } from '@renderer/lib/utils'
import {
	MAX_LONG_MEMORY_LENGTH,
	MAX_SHORT_MEMORY_LENGTH
} from '../../../../../api/src/constants/memory'
import { cursingGenerate } from './services/cursing-generate'
import { imageAnalyze } from './services/image-analyzer'
import { generateLongMemory, generateShortMemory } from './services/memory-manager'
import type { GetScreenContextReplyResponse, Memory } from './types/ai'

let shortTimeMemories: Memory[] = []
const longTimeMemories: Memory[] = []

// Stress system
// TODO: Implement stress system
// const INCREMENTAL_STRESS = 5
// let stress = 0

export const getScreenContextReply = async (): Promise<GetScreenContextReplyResponse | null> => {
	console.log('\x1b[36m taking screenshot')

	const [base64ImageError, base64Image] = await catchError(window.api.takeScreenshot())

	if (base64ImageError) {
		console.error('Error taking screenshot:', base64ImageError)
		return new AppError('Error taking screenshot', 'Error taking screenshot', 500)
	}

	console.log('\x1b[36m reading image')
	const [imageTranscriptionError, imageTranscriptionResult] = await catchError(
		imageAnalyze(base64Image)
	)

	if (imageTranscriptionError) {
		console.error('Error reading image:', imageTranscriptionError)
		return null // TODO: replate this with a better error handling when implement the api
	}

	console.log('\x1b[33m image transcription: ', imageTranscriptionResult.response)

	console.log('\x1b[36m generating memory and text')

	const [[, memoryResult], [responseResultError, responseResult], [, longMemoryResult]] =
		await Promise.all([
			catchError(generateShortMemory(imageTranscriptionResult.response)),
			catchError(
				cursingGenerate(imageTranscriptionResult.response, shortTimeMemories, longTimeMemories)
			),
			...(shortTimeMemories.length === MAX_SHORT_MEMORY_LENGTH
				? [catchError(generateLongMemory(shortTimeMemories))]
				: [])
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

	const responseText = responseResultError
		? 'puta que pariu, deu ruim aqui (500). Aparentemente o dev que fez essa IA não sabe programar tb.'
		: responseResult?.response

	shortTimeMemories.push({
		role: 'assistant',
		content: responseText,
		date: new Date().toISOString()
	})

	console.log('\x1b[33m response: ', responseResult)
	console.log('\x1b[33m result: ', responseText)
	console.log('\x1b[36m ----------done----------')

	const tokens = {
		'gpt-4.1-nano': {
			input:
				imageTranscriptionResult.usage.promptTokens +
				(memoryResult?.usage.promptTokens ?? 0) +
				(longMemoryResult?.usage.promptTokens ?? 0),
			output:
				(responseResult?.usage.completionTokens ?? 0) +
				(memoryResult?.usage.completionTokens ?? 0) +
				(longMemoryResult?.usage.completionTokens ?? 0)
		},
		'gpt-4.1': {
			input: responseResult?.usage.promptTokens ?? 0,
			output: responseResult?.usage.completionTokens ?? 0
		}
	}

	console.log(tokens)
	console.log(shortTimeMemories)

	return {
		tokens,
		response: responseText
	}
}
