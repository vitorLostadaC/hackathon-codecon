import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import type { AiServiceResponse, Memory } from '../../types/ai'

const model = openai('gpt-4.1-nano')

export const generateShortMemory = async (message: string): Promise<AiServiceResponse> => {
	const { text, usage } = await generateText({
		model,
		maxTokens: 200,
		messages: [
			{
				role: 'system',
				content:
					'Você é um assistente de IA especialista. Sua tarefa é analisar a seguinte mensagem e determinar se ela contém alguma informação importante para ser lembrada. Se contiver, retorne um resumo conciso que capture apenas as informações essenciais que sejam relevantes para o contexto do usuário. Se não contiver, retorne uma string vazia.'
			},
			{
				role: 'user',
				content: message
			}
		]
	})

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

export const generateLongMemory = async (shortTimeMemory: Memory[]): Promise<AiServiceResponse> => {
	const { text, usage } = await generateText({
		model,
		maxTokens: 150,
		messages: [
			{
				role: 'system',
				content: `Você é um assistente de memória. Sua tarefa é ler uma lista de memórias de curto prazo e criar um resumo curto e claro, destacando apenas os fatos mais importantes e únicos. Ignore detalhes repetidos ou irrelevantes. Resuma tudo em uma frase. Responda apenas em português. Não inclua exemplos na resposta, apenas o resumo.

Exemplo:

Entrada:

O usuário adicionou um novo contato chamado João na lista de contatos.
O usuário abriu a página de configurações do aplicativo.
O usuário tentou adicionar um contato, mas esqueceu de preencher o telefone.
O usuário adicionou um novo contato chamado João na lista de contatos.

Saída:
O usuário adicionou o contato João e abriu a página de configurações.
`
			},
			{
				role: 'user',
				content: shortTimeMemory
					.filter((memory) => memory.role === 'user')
					.map((memory) => memory.content)
					.join('\n')
			}
		]
	})
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
