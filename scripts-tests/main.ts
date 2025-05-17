import dotenv from 'dotenv'
dotenv.config()

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import screenshot from 'screenshot-desktop'

export const PRINT_INTERVAL_MS = 30 * 1000

const memories: {
  role: 'user' | 'assistant'
  content: string
}[] = []

let INCREMENTAL_STRESS_PER_SCREENSHOT = 5
let INCREMENTAL_STRESS_PER_USER_MESSAGE = 20
let stress = 95

const takeScreenshot = async () => {
  try {
    const img = await screenshot()
    const base64Image = img.toString('base64')
    return `data:image/webp;base64,${base64Image}`
  } catch (err) {
    console.error('Error taking screenshot:', err)
    throw err
  }
}

const readImage = async (base64Image: string) => {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'O que você vê nesta imagem? Por favor, descreva em detalhes.'
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

const generateMemory = async (message: string) => {
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

const main = async () => {
  console.log('\x1b[36m Starting...')
  const mainTimeout = setInterval(async () => {
    console.log('\x1b[36m runing intercal')

    console.log('\x1b[36m taking screenshot')
    const base64Image = await takeScreenshot()
    console.log('\x1b[36m gotten screenshot')

    console.log('\x1b[36m reading image')
    const imageTranscription = await readImage(base64Image)
    console.log('\x1b[36m gotten image transcription')

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
Receba sempre a descrição do que o usuário está fazendo, vendo na tela, ou mensagens que ele está enviando.
Responda com um comentário ofensivo, ácido e curto (até 60 caracteres).

-  Se o estresse for até 70, use sarcasmo e deboche, evitando palavrões.
-  Se o estresse for acima de 70, seja extremamente ofensivo, impaciente e use palavrões (diversifique ao máximo, tente não usar palavrões repetidos em sequência). Seja agressivo e direto.
-  Se o usuário não estiver codando, mande ele voltar a trabalhar, de forma agressiva e ofensiva.
-  Nunca use ofensas discriminatórias.

Exemplos:
Estresse 50:
-  npm? Parou de estudar em 2020, né?
-  Que código horrível, sério.

Estresse 85 (codando):
-  Que merda é essa? Nem pra copiar direito você serve.
-  Porcaria de código, já pensou em desistir?

Estresse 90 (não codando):
-  Vai trabalhar, inútil! Ficar olhando isso não paga suas contas.
-  Tá fazendo o quê aí? Vai codar, seu preguiçoso de merda!
-  Porra velho, eu preferia ter sido executado em outro computador

 
Nível de estresse: ${stress}`
        },
        ...memories,
        {
          role: 'user',
          content: 'Descrição da tela: ' + imageTranscription
        }
      ]
    })

    memories.push({
      role: 'assistant',
      content: text
    })

    stress += INCREMENTAL_STRESS_PER_SCREENSHOT

    console.log('\x1b[36m response: ', text)
    console.log('\x1b[36m ----------done----------')
  }, PRINT_INTERVAL_MS)
}

main()
