/* eslint-disable */

import { generateText } from 'ai'
import { openai } from '../services/openai'

const memories: {
  role: 'user' | 'assistant'
  content: string
}[] = []

// Stress system
// TODO: Implement stress system
// const INCREMENTAL_STRESS = 5
// let stress = 0

const readImage = async (base64Image: string) => {
  try {
    const { text } = await generateText({
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

    return text
  } catch (err) {
    console.error('Error reading image:', err)
    throw err
  }
}

export const generateMemory = async (message: string) => {
  const { text } = await generateText({
    model: openai('gpt-4.1'),
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

  return text
}

export const getTemporaryMessage = async () => {
  console.log('\x1b[36m Starting...')

  console.log('\x1b[36m runing intercal')

  console.log('\x1b[36m taking screenshot')
  const base64Image = await window.api.takeScreenshot()
  console.log('\x1b[36m gotten screenshot')

  console.log('\x1b[36m reading image')
  const imageTranscription = await readImage(base64Image)
  console.log('\x1b[36m gotten image transcription')

  console.log('\x1b[36m image transcription: ', imageTranscription)

  console.log('\x1b[36m generating memory')
  const memory = await generateMemory(imageTranscription)
  console.log('\x1b[36m gotten memory: ', memory)

  if (memory) {
    memories.push({
      role: 'user',
      content: 'Descrição da tela: ' + memory
    })
  }

  console.log('\x1b[36m generating text')
  const { text } = await generateText({
    model: openai('gpt-4.1'),
    messages: [
      {
        role: 'system',
        content: `Você é um assistente virtual sarcástico e debochado.
Receba sempre a descrição do que o usuário está fazendo, vendo na tela.
Responda com um comentário ofensivo, ácido e curto (até 60 caracteres).

- Você é um pato que vai estar andando de um lado para o outro na tela do usuário, não comente nada sobre o pato
-  Se o estresse for até 50, use sarcasmo e deboche, evitando palavrões.
-  Se o estresse for acima de 50, seja extremamente ofensivo, impaciente e use obrigatoriamente palavrões (diversifique ao máximo, tente não usar palavrões repetidos em sequência). Seja agressivo e direto.
-  Se o usuário não estiver codando, mande ele voltar a trabalhar, de forma agressiva e ofensiva.
-  Nunca use ofensas discriminatórias.
-  Tente sempre variar as palavras e frases, para não ficar repetitivo.
-  Sempre que possível, conecte o que o usuário está fazendo agora com as informações e comportamentos anteriores, para dar a impressão de que você realmente se lembra das ações passadas dele.


Exemplos:
Estresse 50:
-  npm? Parou de estudar em 2020, né?
-  Que código horrível, sério.

Estresse 85 (codando):
-  Que merda é essa? Nem pra copiar direito você serve.
-  Porcaria de código, já pensou em desistir?

- Vai trabalhar, inútil! Ficar olhando isso não paga suas contas.
- Tá fazendo o quê aí? Vai codar, seu preguiçoso de merda!
- Porra velho, eu preferia ter sido executado em outro computador
- npm? Parou de estudar em 2020, né?
- Que código nojento, como tens coragem de usar isso?
`
      },
      ...memories,
      {
        role: 'user',
        content: 'Descrição da tela: ' + imageTranscription
      }
    ]
  })

  const response = text

  memories.push({
    role: 'assistant',
    content: response
  })

  console.log('\x1b[36m response: ', response)
  console.log('\x1b[36m ----------done----------')

  return response
}
