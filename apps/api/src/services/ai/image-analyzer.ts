import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import type { AiServiceResponse } from '../../types/ai'

const model = openai('gpt-4.1-nano')

export const imageAnalyze = async (base64Image: string): Promise<AiServiceResponse> => {
	const { text, usage } = await generateText({
		model,
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: 'Analise esta captura de tela e identifique: quais aplicações estão abertas e qual está em foco, que tipo de conteúdo está sendo visualizado ou editado incluindo textos relevantes e dados em exibição, e qual atividade o usuário está realizando no momento incluindo a etapa do processo ou workflow atual. Seja conciso e objetivo, priorizando informações essenciais para entender o contexto de trabalho do usuário.'
					},
					{
						type: 'image',
						image: base64Image,
						providerOptions: {
							openai: { imageDetail: 'high' }
						}
					}
				]
			}
		]
	})

	console.log(text)

	return {
		tokens: {
			[model.modelId]: {
				input: usage.promptTokens,
				output: usage.completionTokens
			}
		},
		response: text
	}
}
