import { generateText } from 'ai'
import { openai } from '../../services/openai'
import type { AiResponse } from '../types/ai'

export const imageAnalyze = async (base64Image: string): Promise<AiResponse<string>> => {
  const { text, usage } = await generateText({
    model: openai('gpt-4.1-nano'),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analise esta captura de tela e identifique: quais aplicações estão abertas e qual está em foco, que tipo de conteúdo está sendo visualizado ou editado incluindo textos relevantes e dados em exibição, e qual atividade o usuário está realizando no momento incluindo a etapa do processo ou workflow atual. Seja conciso e objetivo, priorizando informações essenciais para entender o contexto de trabalho do usuário.`
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

  return {
    usage,
    response: text
  }
}
