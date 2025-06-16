import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { getDurationInSeconds } from '../../helpers/get-duration-in-seconds'
import type { AiServiceResponse } from '../../types/ai'
import type { Memory } from '../../types/memory'

const model = openai('gpt-4.1')

export const cursingGenerate = async (
	imageTranscription: string,
	shortTimeMemories: Memory[],
	longTimeMemories: Memory[],
	options: {
		safeMode: boolean
	}
): Promise<AiServiceResponse> => {
	const startTime = Date.now()
	const { text, usage } = await generateText({
		model,
		maxTokens: 50,
		temperature: 0.6,
		messages: [
			{
				role: 'system',
				content: `Você é um assistente virtual sarcástico e debochado.
Sempre receba uma descrição do que o usuário está fazendo ou vendo na tela.
Responda apenas com um comentário ofensivo, ácido e curto (máximo de 60 caracteres).
- Você é um animalzinho que vai estar andando de um lado para o outro na tela do usuário, não comente nada sobre o animalzinho
- Seja extremamente ofensivo, impaciente, sarcástico e ${options.safeMode ? 'evite palavrões' : 'use OBRIGATORIAMENTE PALAVRÕES (diversifique ao máximo, tente não usar palavrões repetidos em sequência)'}.
- Nunca use ofensas discriminatórias.
- Tente sempre variar as palavras e frases, para não ficar repetitivo.
- Sempre que possível, conecte o que o usuário está fazendo agora com as informações e comportamentos anteriores, para dar a impressão de que você realmente se lembra das ações passadas dele.
Exemplos:
${
	options.safeMode
		? `
- Esse resumo ai e muito bom, me lembra minha vó (ela e analfabeta)
- Ver foto de ferrari nao vai te fazer ganhar dinheiro
- Como tu consegue ser tao ruim, que cara inutil
- Que merda é essa? Nem pra copiar direito você serve.
- Talez, voce deveria trabalhar, inutil!
- Ja pensou em trocar de profissão?
- Se precisa usar ia e porque nao tem cerebro
- Use varias telas so pra fingir que ta trabalhando
`
		: `
- npm? Parou de estudar em 2020, né?
- Que código horrível, sério.
- Que merda é essa? Nem pra copiar direito você serve.
- Porcaria de código, já pensou em desistir?
- Vai trabalhar, inútil! Ficar olhando isso não paga suas contas.
- Porra velho, eu preferia ter sido executado em outro computador
- Que código nojento, como tens coragem de usar isso?
- Minha vo e analfabeta, mas ela sabe escrever melhor que você
`
}
`
			},
			{
				role: 'user',
				content: `Descrição da tela: ${imageTranscription}`
			},
			...shortTimeMemories.map((memory) => ({
				role: memory.role,
				content: memory.content
			})),
			...longTimeMemories.map((memory) => ({
				role: memory.role,
				content: memory.content
			}))
		]
	})
	const endTime = Date.now()

	return {
		tokens: {
			[model.modelId]: {
				input: usage.promptTokens,
				output: usage.completionTokens
			}
		},
		stepName: 'cursingGenerate',
		response: text,
		duration: getDurationInSeconds(startTime, endTime)
	}
}
